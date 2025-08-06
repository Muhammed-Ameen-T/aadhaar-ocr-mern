import React from 'react';
import { Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import type { IAadhaar } from '../types/IAadhaar';

interface AadhaarCardProps {
  data: IAadhaar | null;
  isLoading: boolean;
}

const AadhaarCard: React.FC<AadhaarCardProps> = ({ data, isLoading }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Extracted Aadhaar Information</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-700 font-medium">Extracting data...</p>
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 border border-green-200">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Data extracted successfully!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Name</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.dob}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.gender}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">UID</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.uid}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg col-span-1 sm:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.address}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Pincode</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.pincode}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Age Band</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{data.age_band}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg col-span-1 sm:col-span-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">UID Match Status</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {data.isUidSame ? 'Match' : 'Mismatch'}
                </p>
              </div>
              {data.isUidSame ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <FileText className="h-10 w-10 text-gray-400" />
          <p className="mt-4 text-gray-500">Upload your Aadhaar images to see the results here.</p>
        </div>
      )}
    </div>
  );
};

export default AadhaarCard;