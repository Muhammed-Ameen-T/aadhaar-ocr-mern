import { Shield, Zap, Clock } from 'lucide-react';

function AppHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-3">
            <div className="p-0 bg-transparent rounded-lg">
              <img
                src="adhaar-logo.png"
                alt="Aadhaar Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Aadhaar OCR System</h1>
              <p className="text-xs sm:text-sm text-gray-600">Secure document parsing & data extraction</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Fast</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;