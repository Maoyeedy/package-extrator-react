import { gunzipSync } from 'fflate';

export type ExtractedFileContent = Record<string, Uint8Array>;

interface TarHeader {
    name: string;
    size: number;
}

export class UnityExtractClient {
    private readonly BLOCK_SIZE = 512;

    async extract(arrayBuffer: ArrayBuffer): Promise<ExtractedFileContent> {
        try {
            const unzipped = await Promise.resolve(gunzipSync(new Uint8Array(arrayBuffer)));
            return this.parseTarball(unzipped);
        } catch (error) {
            throw error instanceof Error && error.message.includes('fflate')
                ? new Error('Invalid gzip file')
                : new Error('Invalid tarball structure');
        }
    }

    private parseTarHeader(header: Uint8Array): TarHeader | null {
        const nameBuffer = header.slice(0, 100);
        const name = new TextDecoder().decode(nameBuffer).replace(/\0/g, '').trim();
        if (!name) return null;

        const sizeBuffer = header.slice(124, 136);
        const sizeOctal = new TextDecoder().decode(sizeBuffer).replace(/\0/g, '').trim();
        const size = parseInt(sizeOctal, 8);

        return isNaN(size) ? null : { name, size };
    }

    private isNullBlock(block: Uint8Array): boolean {
        return block.every(byte => byte === 0);
    }

    private parseTarball(data: Uint8Array): ExtractedFileContent {
        const files: ExtractedFileContent = {};
        let offset = 0;

        while (offset < data.length - this.BLOCK_SIZE) {
            const header = data.slice(offset, offset + this.BLOCK_SIZE);

            if (this.isNullBlock(header)) break;

            const parsedHeader = this.parseTarHeader(header);
            if (!parsedHeader) {
                offset += this.BLOCK_SIZE;
                continue;
            }

            const { name, size } = parsedHeader;
            offset += this.BLOCK_SIZE;

            if (size > 0 && offset + size <= data.length && !name.endsWith('/')) {
                files[name] = data.slice(offset, offset + size);
            }

            offset += Math.ceil(size / this.BLOCK_SIZE) * this.BLOCK_SIZE;
        }

        return this.convert(files);
    }

    private convert(files: ExtractedFileContent): ExtractedFileContent {
        const result: ExtractedFileContent = {};
        const decoder = new TextDecoder();

        for (const [path, content] of Object.entries(files)) {
            const parts = path.split('/');
            if (parts.length < 2) continue;

            const filename = parts.pop() ?? '';
            const basePath = parts.join('/');

            switch (filename) {
                case 'pathname':
                    try {
                        const newPath = decoder.decode(content).split('\n')[0].trim();
                        if (!newPath) continue;

                        const assetPath = `${basePath}/asset`;
                        const assetContent = files[assetPath];
                        result[newPath] = assetContent;

                        const metaContent = files[`${basePath}/asset.meta`] ?? files[`${basePath}/metaData`];
                        result[`${newPath}.meta`] = metaContent;
                    } catch {
                        continue;
                    }
                    break;
            }
        }

        return result;
    }
}
