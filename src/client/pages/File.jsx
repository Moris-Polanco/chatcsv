import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getFile from '@wasp/queries/getFile';
import askQuestion from '@wasp/actions/askQuestion';

export function FilePage() {
  const { fileId } = useParams();
  const { data: file, isLoading, error } = useQuery(getFile, { fileId });
  const askQuestionFn = useAction(askQuestion);
  const [newQuestion, setNewQuestion] = useState('');

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleAskQuestion = () => {
    askQuestionFn({ text: newQuestion, fileId });
    setNewQuestion('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">File: {file.description}</h1>

      <div className="mb-4">
        <h2 className="text-lg font-bold">Content:</h2>
        <p>{file.content}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold">Ask a Question:</h2>
        <div className="flex gap-x-4">
          <input
            type="text"
            placeholder="Question"
            className="px-1 py-2 border rounded text-lg"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button
            onClick={handleAskQuestion}
            className="bg-blue-500 hover:bg-blue-700 px-2 py-2 text-white font-bold rounded"
          >
            Ask
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">Questions:</h2>
        {file.questions.map((question) => (
          <div key={question.id} className="border rounded p-2 mb-2">
            <p className="font-bold">Q: {question.text}</p>
            {question.answer && <p className="mt-2">A: {question.answer.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}