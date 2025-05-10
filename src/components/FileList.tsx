import React from 'react';
import FileListItem from './FileListItem';
import type { ExtractedFileContent } from '../UnityExtractor';
import { zip } from 'fflate'; // For zipping categories

interface FileToZip {
  path: string;
  content: Uint8Array;
}

interface FileListProps {
  files: ExtractedFileContent;
  excludeMeta: boolean;
  categorizeByExtension: boolean;
  maintainStructure: boolean;
  enablePreview: boolean;
  showFileSize: boolean;
  downloadCategoryLabel: (category: string) => string;
}

type CategorizedFiles = Record<string, FileToZip[]>;

const FileList: React.FC<FileListProps> = ({
  files,
  excludeMeta,
  categorizeByExtension,
  maintainStructure,
  enablePreview,
  showFileSize,
  downloadCategoryLabel,
}) => {
  const getFilteredAndCategorizedFiles = () => {
    const categorized: CategorizedFiles = {};
    const allFiles: FileToZip[] = [];

    for (const [path, content] of Object.entries(files)) {
      // Skip directories
      if (!(content instanceof Uint8Array)) {
        continue;
      }

      // Skip meta files if excluded
      if (excludeMeta && path.endsWith('.meta')) {
        continue;
      }

      const fileEntry = { path, content };
      allFiles.push(fileEntry);

      if (categorizeByExtension) {
        const extension = path.split('.').pop()?.toLowerCase() ?? 'other';
        if (!(extension in categorized)) {
          categorized[extension] = [];
        }
        categorized[extension].push(fileEntry);
      }
    }
    return { categorized, allFiles };
  };

  const { categorized, allFiles } = getFilteredAndCategorizedFiles();

  const downloadCategory = (extension: string, categoryFiles: FileToZip[]) => {
    const filesToZip: Record<string, Uint8Array> = {};
    categoryFiles.forEach(file => {
      const filePath = maintainStructure ? file.path : file.path.split('/').pop() ?? file.path;
      filesToZip[filePath] = file.content;
    });

    zip(filesToZip, (err, data) => {
      if (err) {
        console.error('Error zipping category:', err);
        alert('Error creating ZIP file for category.');
        return;
      }
      const blob = new Blob([data], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${extension}_files.zip`;
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  };

  if (categorizeByExtension) {
    return (
      <div id="fileListContainer">
        {Object.entries(categorized).sort(([extA], [extB]) => extA.localeCompare(extB)).map(([extension, catFiles]) => (
          <div key={extension} className="category">
            <h3>{extension.toUpperCase()}</h3>
            <ul>
              {catFiles.sort((a,b) => a.path.localeCompare(b.path)).map(file => (
                <FileListItem
                  key={file.path}
                  path={file.path}
                  content={file.content}
                  maintainStructure={maintainStructure}
                  enablePreview={enablePreview}
                  showFileSize={showFileSize}
                />
              ))}
            </ul>
            {catFiles.length > 0 && (
                <button
                    type="button"
                    onClick={() => {
                        downloadCategory(extension, catFiles);
                    }}
                >
                    {downloadCategoryLabel(extension.toUpperCase())}
                </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="fileListContainer">
      <ul>
        {allFiles.sort((a,b) => a.path.localeCompare(b.path)).map(file => (
          <FileListItem
            key={file.path}
            path={file.path}
            content={file.content}
            maintainStructure={maintainStructure}
            enablePreview={enablePreview}
            showFileSize={showFileSize}
          />
        ))}
      </ul>
    </div>
  );
};

export default FileList;
