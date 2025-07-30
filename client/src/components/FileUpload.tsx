import React, { useState, useRef } from 'react';
import { Upload, Check, Loader2, X, Crop } from 'lucide-react';
import ImageCropper from './ImageCropping';

interface FileUploadProps {
  title: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  isUploading: boolean;
  uploadSuccess: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  onFileSelect,
  file,
  isUploading,
  uploadSuccess
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, and PNG files are allowed');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setOriginalFile(selectedFile);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert blob to file
    const croppedFile = new File([croppedBlob], originalFile?.name || 'cropped-aadhaar.jpg', {
      type: 'image/jpeg'
    });
    
    onFileSelect(croppedFile);
    
    // Clean up previous URL if exists
    if (croppedImageUrl) {
      URL.revokeObjectURL(croppedImageUrl);
    }
    
    setCroppedImageUrl(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setOriginalFile(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalFile(null);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (croppedImageUrl) {
      URL.revokeObjectURL(croppedImageUrl);
      setCroppedImageUrl('');
    }
    setError('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : uploadSuccess
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              disabled={isUploading}
            />
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Upload className="h-full w-full" />
              </div>
              <p className="text-base text-gray-600 mb-2">
                <button
                  onClick={openFileDialog}
                  className="font-medium text-blue-600 hover:text-blue-500 underline-offset-2 hover:underline"
                >
                  Click to upload
                </button>{' '}
                or drag and drop your Aadhaar card
              </p>
              <p className="text-sm text-gray-500 mb-4">JPG, JPEG, PNG (max. 5MB)</p>
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200">
                <Crop className="h-4 w-4 mr-2" />
                Auto-cropping enabled
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
                <p className="text-base text-gray-600">Uploading your Aadhaar card...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                </div>
              </div>
            ) : uploadSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-base text-green-600 font-medium">Upload successful!</p>
                <div className="relative group">
                  <img
                    src={croppedImageUrl}
                    alt="Uploaded Aadhaar Card"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-green-200 shadow-lg"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{file.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={croppedImageUrl}
                    alt="Aadhaar Card Preview"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-gray-200 shadow-md"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-base text-gray-700 font-medium">Ready to upload</p>
                  <p className="text-sm text-gray-600">{file.name}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 flex items-center">
            <X className="h-4 w-4 mr-2 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && originalFile && (
        <ImageCropper
          image={originalFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default FileUpload;