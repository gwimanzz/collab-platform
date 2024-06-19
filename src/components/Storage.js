import React, { useState } from 'react';
import { uploadFile, deleteFile, downloadFile } from '../api/auth';

function FileManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const result = await uploadFile(selectedFile);
        console.log('File uploaded:', result);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (filename) {
      try {
        const result = await deleteFile(filename);
        console.log('File deleted:', result);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (filename) {
      try {
        await downloadFile(filename);
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  };

  return (
    <div>
      <h2>File Management</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Filename"
      />
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default FileManagement;
