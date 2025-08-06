import { useState } from 'react';
import { FileText, Shield } from 'lucide-react';
import FileUpload from './components/FileUpload.tsx';
import AadhaarCard from './components/AadhaarCard.tsx';
import AppHeader from './components/Header.tsx';
import AppFooter from './components/Footer.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AadhaarResponse, IAadhaar } from './types/IAadhaar.ts';

function App() {
  const [aadhaarData, setAadhaarData] = useState<IAadhaar | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOcrResult = (data: AadhaarResponse) => {
    setAadhaarData(data.data || null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppHeader />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Upload Aadhaar Images
              </h2>

              <FileUpload
                title="Aadhaar Card Upload"
                onOcrResult={(data) => {
                  setIsProcessing(true);
                  handleOcrResult(data);
                }}
              />
            </div>

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

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <AadhaarCard data={aadhaarData} isLoading={isProcessing} />
            </div>

            {(isProcessing || aadhaarData) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <Shield className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">
                      {isProcessing ? 'Processing Your Documents' : 'Processing Complete'}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isProcessing
                        ? 'Our AI is extracting data from your Aadhaar images using advanced OCR technology...'
                        : 'Successfully extracted all available information from your Aadhaar card.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default App;