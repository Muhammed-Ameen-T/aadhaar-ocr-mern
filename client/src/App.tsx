import { useState } from 'react';
import { FileText, Shield } from 'lucide-react';
import JsonDisplay from './components/JsonDisplay.tsx';
import FileUpload from './components/FileUpload.tsx';
import AadhaarCard from './components/AadhaarCard.tsx';
import type { IAadhaarData } from './interfaces/IAadhaarData.ts';
import AppHeader from './components/Header.tsx'; 
import AppFooter from './components/Footer.tsx'; 

function App() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);
  const [frontSuccess, setFrontSuccess] = useState(false);
  const [backSuccess, setBackSuccess] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [aadhaarData, setAadhaarData] = useState<IAadhaarData | null>(null);
  const [jsonResponse, setJsonResponse] = useState<any>(null);

  const handleFileSelect = (type: 'front' | 'back') => (file: File | null) => {
    if (type === 'front') {
      setFrontFile(file);
      if (file) {
        simulateUpload('front');
      } else {
        setFrontSuccess(false);
      }
    } else {
      setBackFile(file);
      if (file) {
        simulateUpload('back');
      } else {
        setBackSuccess(false);
      }
    }
  };

  const simulateUpload = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontUploading(true);
      setTimeout(() => {
        setFrontUploading(false);
        setFrontSuccess(true);
      }, 2000);
    } else {
      setBackUploading(true);
      setTimeout(() => {
        setBackUploading(false);
        setBackSuccess(true);
      }, 2000);
    }
  };

  const handleParseAadhaar = async () => {
    if (!frontFile || !backFile) return;

    setIsParsing(true);

    // Simulate API call
    setTimeout(() => {
      const mockData: IAadhaarData = {
        uid: '1234 5678 9012',
        name: 'RAJESH KUMAR',
        dateOfBirth: '15/03/1985',
        gender: 'Male',
        address: 'S/O: Ram Kumar, Village: Rampur, Post: Rampur, District: Aligarh, State: Uttar Pradesh - 202001',
        fatherName: 'RAM KUMAR',
        mobileNumber: '+91 98765 43210'
      };

      const mockJsonResponse = {
        status: 'success',
        confidence: 0.95,
        processing_time: 2.3,
        extracted_data: mockData,
        metadata: {
          front_image_quality: 'high',
          back_image_quality: 'medium',
          document_type: 'aadhaar_card',
          extraction_timestamp: new Date().toISOString()
        }
      };

      setAadhaarData(mockData);
      setJsonResponse(mockJsonResponse);
      setIsParsing(false);
    }, 3000);
  };

  const canParse = frontSuccess && backSuccess && !isParsing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Section - Upload */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Upload Aadhaar Images
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <FileUpload
                  title="Aadhaar Front"
                  onFileSelect={handleFileSelect('front')}
                  file={frontFile}
                  isUploading={frontUploading}
                  uploadSuccess={frontSuccess}
                />
                <FileUpload
                  title="Aadhaar Back"
                  onFileSelect={handleFileSelect('back')}
                  file={backFile}
                  isUploading={backUploading}
                  uploadSuccess={backSuccess}
                />
              </div>

              <button
                onClick={handleParseAadhaar}
                disabled={!canParse}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  canParse
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isParsing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>PARSING AADHAAR...</span>
                  </div>
                ) : (
                  'PARSE AADHAAR'
                )}
              </button>

              {!canParse && !isParsing && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please upload both front and back images to proceed
                </p>
              )}
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Advanced OCR with 99%+ accuracy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Secure processing with data encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Real-time validation and error detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Structured JSON output for easy integration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Results */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <AadhaarCard data={aadhaarData} isLoading={isParsing} />
              <JsonDisplay data={jsonResponse} />
            </div>

            {/* Processing Info */}
            {(isParsing || aadhaarData) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                    {isParsing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <Shield className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">
                      {isParsing ? 'Processing Your Documents' : 'Processing Complete'}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isParsing
                        ? 'Our AI is extracting data from your Aadhaar images using advanced OCR technology...'
                        : 'Successfully extracted all available information from your Aadhaar card.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}

export default App;