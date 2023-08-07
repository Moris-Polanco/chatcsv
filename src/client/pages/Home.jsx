import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getFile from '@wasp/queries/getFile';

export function HomePage() {
  const { data: files, isLoading, error } = useQuery(getFile);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      {files.map((file) => (
        <div
          key={file.id}
          className='flex items-center justify-between bg-gray-100 p-4 mb-4 rounded-lg'
        >
          <div>{file.description}</div>
          <div>
            <Link
              to={`/file/${file.id}`}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2'
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}