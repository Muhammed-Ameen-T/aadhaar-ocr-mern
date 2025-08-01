import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { AadhaarResponse } from '../types/aadhaar';

interface JsonDisplayProps {
  data: AadhaarResponse | null;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!data) return null;

  return (
    <div className="w-full mt-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-sm font-semibold text-gray-800">JSON Response</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy JSON"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="p-4">
            <pre className="text-xs bg-gray-50 rounded-lg p-4 overflow-x-auto border border-gray-200">
              <code className="text-gray-800">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {!isExpanded && (
          <div className="p-4">
            <div className="text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Status:</span> {data.status || 'N/A'}
                </div>
                {/* <div>
                  <span className="font-medium">Confidence:</span> {data.confidence || 'N/A'}
                </div> */}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click to expand full JSON response
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonDisplay;