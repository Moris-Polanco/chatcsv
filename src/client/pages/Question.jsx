import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getQuestion from '@wasp/queries/getQuestion';
import answerQuestion from '@wasp/actions/answerQuestion';

export function Question() {
  const { questionId } = useParams();
  const { data: question, isLoading, error } = useQuery(getQuestion, { questionId });
  const answerQuestionFn = useAction(answerQuestion);
  const [answerText, setAnswerText] = useState('');

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleAnswerQuestion = () => {
    answerQuestionFn({ text: answerText, questionId });
    setAnswerText('');
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl mb-4'>{question.text}</h2>
      <textarea
        className='p-2 border rounded w-full mb-4'
        placeholder='Your answer'
        rows='4'
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      ></textarea>
      <button
        onClick={handleAnswerQuestion}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Answer
      </button>
      <Link to={`/file/${question.file.id}`} className='ml-4'>Go back to file</Link>
    </div>
  );
}