import React from 'react';

interface FileDropZoneProps {
  onFileDrop: (file: File) => void;
  label: string;
  invalidFileMessage: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileDrop, label, invalidFileMessage }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.unitypackage')) {
        onFileDrop(file);
      } else {
        alert(invalidFileMessage);
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.unitypackage')) {
        onFileDrop(file);
      } else {
        alert(invalidFileMessage);
      }
      // Reset file input to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <>
      <div
        id="dropZone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        {label}
      </div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        accept=".unitypackage"
        onChange={handleFileInputChange}
      />
    </>
  );
};

export default FileDropZone;
