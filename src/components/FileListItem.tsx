import React, { useState } from 'react';

interface FileListItemProps {
  path: string;
  content: Uint8Array;
  maintainStructure: boolean;
  enablePreview: boolean;
  showFileSize: boolean;
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

const isImageFile = (path: string): boolean => {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tga'].includes(extension);
};

const FileListItem: React.FC<FileListItemProps> = ({
  path,
  content,
  maintainStructure,
  enablePreview,
  showFileSize,
}) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const fileName = maintainStructure ? path : path.split('/').pop() || path;

  // Clean up the object URL when the component unmounts or URL changes
  React.useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  const handleMouseOver = () => {
    if (enablePreview && isImageFile(path)) {
      setIsPreviewVisible(true);
    }
  };

  const handleMouseOut = () => {
    if (enablePreview && isImageFile(path)) {
      setIsPreviewVisible(false);
    }
  };

  return (
    <li className="file-list-item">
      <a
        href={url}
        download={fileName}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {fileName}
      </a>
      {showFileSize && (
        <span className="file-info">
          ({formatFileSize(content.byteLength)})
        </span>
      )}
      {enablePreview && isImageFile(path) && isPreviewVisible && (
        <img src={url} alt={`${fileName} preview`} className="preview" />
      )}
    </li>
  );
};

export default FileListItem;
