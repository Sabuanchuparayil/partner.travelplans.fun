import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
