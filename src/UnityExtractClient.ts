import { unzlibSync } from 'fflate';

type FileMap = Record<string, Uint8Array>;

export class UnityExtractClient {
    private decoder = new TextDecoder();

    async extract(arrayBuffer: ArrayBuffer): Promise<FileMap> {
        return this.parseTarball(unzlibSync(new Uint8Array(arrayBuffer)));
    }

    private parseTarball(data: Uint8Array): FileMap {
        const files: FileMap = {};
        let offset = 0;

        while (offset < data.length) {
            const { name, size } = this.parseHeader(data.slice(offset, offset + 512));
            if (!name) break;

            if (size > 0) {
                files[name] = data.slice(offset + 512, offset + 512 + size);
            } else {
                files[name] = new Uint8Array(0);
            }

            offset += 512 + Math.ceil(size / 512) * 512;
        }

        return this.convert(files);
    }

    private parseHeader(header: Uint8Array): { name: string; size: number } {
        const name = this.decoder.decode(header.slice(0, 100)).replace(/\0/g, '').trim();
        const size = parseInt(this.decoder.decode(header.slice(124, 136)).trim(), 8) || 0;
        return { name, size };
    }

    private convert(files: FileMap): FileMap {
        const convertedFiles: FileMap = {};

        Object.keys(files)
            .filter(filename => filename.endsWith('/pathname'))
            .forEach(dir => {
                const basePath = dir.replace('/pathname', '');
                const pathContent = this.decoder.decode(files[dir]);
                const newPath = pathContent.split('\n')[0].trim();

                if (!newPath) return;

                this.processAssetFile(files, convertedFiles, basePath, newPath);
                this.processMetaFiles(files, convertedFiles, basePath, newPath);
            });

        this.processRemainingFiles(files, convertedFiles);
        return convertedFiles;
    }

    private processAssetFile(files: FileMap, convertedFiles: FileMap, basePath: string, newPath: string): void {
        const assetPath = `${basePath}/asset`;
        if (files[assetPath]) {
            convertedFiles[newPath] = files[assetPath];
        }
    }

    private processMetaFiles(files: FileMap, convertedFiles: FileMap, basePath: string, newPath: string): void {
        const metaPaths = [
            `${newPath}.meta`,
            `${basePath}/asset.meta`,
            `${basePath}/metaData`
        ];

        const metaFile = metaPaths.find(path => files[path]);
        if (metaFile) {
            convertedFiles[`${newPath}.meta`] = files[metaFile];
        }
    }

    private processRemainingFiles(files: FileMap, convertedFiles: FileMap): void {
        const excludedSuffixes = ['/pathname', '/asset', '/asset.meta', '/metaData'];
        Object.entries(files).forEach(([path, content]) => {
            if (!excludedSuffixes.some(suffix => path.endsWith(suffix)) && !convertedFiles[path]) {
                convertedFiles[path] = content;
            }
        });
    }
}
