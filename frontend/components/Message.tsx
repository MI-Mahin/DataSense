import React from 'react';
import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onCopyCSV: (message: MessageType) => void;
  onRetry: (id: string) => void;
}

export function Message({ message, onLike, onDislike, onCopyCSV, onRetry }: MessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-center'}`}>
      <div className={`${message.role === 'user' ? 'max-w-xl' : 'max-w-[1200px] w-full'}`}>
        <div className={`rounded-2xl shadow-sm ${
          message.role === 'user'
            ? 'bg-gray-700 dark:bg-gray-700 text-white px-4 py-2.5'
            : message.error
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-6 py-4'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-6 py-4'
        }`}>
          <div className={`whitespace-pre-wrap leading-relaxed ${
            message.role === 'user' ? 'text-sm' : 'text-base'
          } ${message.error ? 'text-red-700 dark:text-red-300' : ''}`}>
            {message.content}
          </div>
        </div>

        {message.sql && !message.error && (
          <div className="mt-3 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-400 dark:border-gray-600">
              SQL Query
            </div>
            <pre className="p-4 text-sm text-gray-800 dark:text-green-400 overflow-x-auto bg-gray-50 dark:bg-gray-800">
              {message.sql}
            </pre>
          </div>
        )}

        {message.results && message.results.length > 0 && message.columns && !message.error && (
          <div className="mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Results ({message.rowCount || message.results.length} rows)
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    {message.columns.map((col, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {message.results.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {message.columns!.map((col, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action buttons for assistant messages */}
        {message.role === 'assistant' && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => onLike(message.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group border shadow-sm ${
                message.liked 
                  ? 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
              title="Like this response"
            >
              <svg className={`w-4 h-4 ${message.liked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} fill={message.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className={`text-sm ${message.liked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>Like</span>
            </button>
            <button
              onClick={() => onDislike(message.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group border shadow-sm ${
                message.disliked 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-gray-50 dark:bg-gray-800'
              }`}
              title="Dislike this response"
            >
              <svg className={`w-4 h-4 ${message.disliked ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className={`text-sm ${message.disliked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-red-600'}`}>Dislike</span>
            </button>
            {message.results && message.columns && (
              <button
                onClick={() => onCopyCSV(message)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group border border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-800"
                title="Copy results as CSV"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600">Copy CSV</span>
              </button>
            )}
            <button
              onClick={() => onRetry(message.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group border border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-800"
              title="Retry this response"
            >
              <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Retry</span>
            </button>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
