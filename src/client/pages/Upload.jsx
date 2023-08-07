import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAction } from '@wasp/actions';
import uploadFile from '@wasp/actions/uploadFile';

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileData = new FormData();
    fileData.append('file', selectedFile);
    fileData.append('description', fileDescription);

    uploadFile(fileData);
  };

  return (
    <div className='p-4'>
      <input type='file' onChange={handleFileChange} />
      <input
        type='text'
        placeholder='File Description'
        className='px-1 py-2 border rounded text-lg'
        value={fileDescription}
        onChange={(e) => setFileDescription(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className='bg-blue-500 hover:bg-blue-700 px-2 py-2 text-white font-bold rounded'
      >
        Upload
      </button>
      <Link to='/' className='bg-gray-500 hover:bg-gray-700 px-2 py-2 text-white font-bold rounded ml-2'>
        Go Home
      </Link>
    </div>
  );
}