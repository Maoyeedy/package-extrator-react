import React, { useState, useRef, useEffect } from 'react';

interface FileListItemProps {
  path: string;
  content?: Uint8Array;  // Make content optional to handle undefined cases
  maintainStructure: boolean;
  enablePreview: boolean;
  showFileSize: boolean;
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  const size = Math.round(bytes / Math.pow(1024, i)).toString();
  return `${size} ${sizes[i]}`;
};

const isImageFile = (path: string): boolean => {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
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
  const urlRef = useRef<string | null>(null);
  const fileName = maintainStructure ? path : path.split('/').pop() ?? path;

  // Clean up the object URL when the component unmounts - this must be before any conditional returns
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  // Check if content is defined
  if (!content) {
    console.warn(`Content is undefined for file: ${path}`);
    return <li className="file-list-item">Error loading: {fileName}</li>;
  }

  // Only create blob and URL if content exists and URL hasn't been created yet
  if (!urlRef.current) {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    urlRef.current = URL.createObjectURL(blob);
  }

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
        href={urlRef.current || '#'}
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
        <img src={urlRef.current || ''} alt={`${fileName} preview`} className="preview" />
      )}
    </li>
  );
};

export default FileListItem;
