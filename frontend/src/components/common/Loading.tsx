'use client';

import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3 text-lg">読み込み中...</span>
    </div>
  );
};

export default Loading;
