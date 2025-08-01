import React from 'react';
import { User, Phone } from 'lucide-react';
import type { IAadhaarData } from '../types/IAadhaarData.ts';

interface AadhaarCardProps {
  data: IAadhaarData | null;
  isLoading: boolean;
}

const AadhaarCard: React.FC<AadhaarCardProps> = ({ data, isLoading }) => {
  const sampleData: IAadhaarData = {
    aadhaar: "1234 XXXX 9012",
    name: "Your Name",
    dob: "DD/MM/YYYY",
    gender: "Gender",
    address: "House No. XXX, Sector XX, Locality, State - 122XX1",
    fatherName: "Father's Name",
    mobileNumber: "+91 98XX5 4XXX0",
  };

  const cardData = data || sampleData;

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col"
        style={{ height: '320px', fontSize: '10px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mb-1"></div>
              <p className="text-xs text-gray-600">Processing...</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-1 bg-white border-b flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-700">भारत सरकार</div>
              <div className="text-xs text-green-600 font-semibold">GOVERNMENT OF INDIA</div>
            </div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="w-16 h-1 bg-orange-500 rounded"></div>
            <div className="w-16 h-1 bg-green-500 rounded"></div>
          </div>
        </div>

        <div className="flex p-3 space-x-3 flex-grow">
          <div className="flex-shrink-0">
            <div className="w-20 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center overflow-hidden">
              <User className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div>
              <div className="text-xs text-gray-600">नाम / Name:</div>
              <div className="text-sm font-semibold text-black">{cardData.name}</div>
            </div>

            <div>
              <div className="text-xs text-gray-600">जन्म तारीख / DOB:</div>
              <div className="text-sm text-black">{cardData.dob}</div>
            </div>

            <div>
              <div className="text-xs text-gray-600">
                {cardData.gender === 'Male' ? 'पुरुष' : 'महिला'} / {cardData.gender}
              </div>
            </div>

            {cardData.fatherName && (
              <div>
                <div className="text-xs text-gray-600">पिता का नाम / Father's Name:</div>
                <div className="text-sm text-black">{cardData.fatherName}</div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <div className="w-14 h-14 bg-white relative">
                <div className="absolute inset-0 grid grid-cols-8 gap-0">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-0 mt-[-10px]">
          <div className="text-xl font-bold text-black tracking-wider text-center">
            {cardData.aadhaar}
          </div>
        </div>

        <div className="px-3 py-1 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-0.5">पता / Address:</div>
          <div className="text-xs text-black leading-tight">
            {cardData.address}
          </div>
        </div>

        {cardData.mobileNumber && (
          <div className="px-3 py-1 border-t border-gray-100 bg-gray-50 flex justify-start flex-shrink-0">
            <div className="flex items-center text-xs">
              <Phone className="h-3 w-3 mr-1" />
              <span>{cardData.mobileNumber}</span>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-1.5 flex-shrink-0">
          <div className="text-center text-sm font-bold">
            आधार - आदमी का अधिकार
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          This is a digitally generated card for preview purposes only
        </p>
      </div>
    </div>
  );
};

export default AadhaarCard;
