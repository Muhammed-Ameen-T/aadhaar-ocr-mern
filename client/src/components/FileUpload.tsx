import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, Crop } from 'lucide-react';
import ImageCropper from './ImageCropping';
import { useMutation } from '@tanstack/react-query';
import { processAadhaarOcr } from '../services/ocrService';
import { toast } from 'react-toastify';
import type { AadhaarResponse } from '../types/aadhaar';
import { AxiosError } from 'axios';

interface FileUploadProps {
  title: string;
  onOcrResult?: (data: AadhaarResponse) => void; // Optional callback to pass OCR result to parent
}

const FileUpload: React.FC<FileUploadProps> = ({ title, onOcrResult }) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<{ front: boolean; back: boolean }>({
    front: false,
    back: false,
  });
  const [error, setError] = useState<string>('');
  const [showCropper, setShowCropper] = useState<'front' | 'back' | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<{ front: string; back: string }>({
    front: '',
    back: '',
  });
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  // Mutation for OCR processing
  const mutation = useMutation({
    mutationFn: () => {
      if (!frontFile || !backFile) {
        throw new Error('Both front and back images are required');
      }
      return processAadhaarOcr(frontFile, backFile);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('✅ Aadhaar OCR processed successfully!');
      } else {
        toast.error(`⚠️ OCR failed: ${data.message}`);
      }

      onOcrResult?.(data);
    },
    onError: (error: unknown) => {
      let message = 'OCR processing failed';

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(`❌ ${message}`);
      setError(message);
    },
  });


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

  const handleFile = (file: File, type: 'front' | 'back') => {
    if (validateFile(file)) {
      setOriginalFile(file);
      setShowCropper(type);
    }
  };

  const handleCropComplete = (croppedBlob: Blob, type: 'front' | 'back') => {
    const croppedFile = new File([croppedBlob], originalFile?.name || `cropped-aadhaar-${type}.jpg`, {
      type: 'image/jpeg',
    });

    if (type === 'front') {
      setFrontFile(croppedFile);
      if (croppedImageUrl.front) URL.revokeObjectURL(croppedImageUrl.front);
      setCroppedImageUrl((prev) => ({ ...prev, front: URL.createObjectURL(croppedBlob) }));
    } else {
      setBackFile(croppedFile);
      if (croppedImageUrl.back) URL.revokeObjectURL(croppedImageUrl.back);
      setCroppedImageUrl((prev) => ({ ...prev, back: URL.createObjectURL(croppedBlob) }));
    }

    setShowCropper(null);
    setOriginalFile(null);
  };

  const handleCropCancel = () => {
    setShowCropper(null);
    setOriginalFile(null);
  };

  const handleRemoveFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontFile(null);
      if (croppedImageUrl.front) URL.revokeObjectURL(croppedImageUrl.front);
      setCroppedImageUrl((prev) => ({ ...prev, front: '' }));
    } else {
      setBackFile(null);
      if (croppedImageUrl.back) URL.revokeObjectURL(croppedImageUrl.back);
      setCroppedImageUrl((prev) => ({ ...prev, back: '' }));
    }
    setError('');
  };

  const handleDrag = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive((prev) => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const openFileDialog = (type: 'front' | 'back') => {
    if (type === 'front') {
      frontFileInputRef.current?.click();
    } else {
      backFileInputRef.current?.click();
    }
  };

  // Handle form submission to trigger OCR processing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !backFile) {
      setError('Please upload both front and back images');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {/* Front Image Upload */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${
          dragActive.front
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : frontFile && mutation.isSuccess
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={(e) => handleDrag(e, 'front')}
        onDragLeave={(e) => handleDrag(e, 'front')}
        onDragOver={(e) => handleDrag(e, 'front')}
        onDrop={(e) => handleDrop(e, 'front')}
      >
        {!frontFile ? (
          <>
            <input
              ref={frontFileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleChange(e, 'front')}
              disabled={mutation.isPending}
            />
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Upload className="h-full w-full" />
              </div>
              <p className="text-base text-gray-600 mb-2">
                <button
                  onClick={() => openFileDialog('front')}
                  className="font-medium text-blue-600 hover:text-blue-500 underline-offset-2 hover:underline"
                >
                  Click to upload
                </button>{' '}
                or drag and drop Aadhaar card (front)
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
            {mutation.isPending ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
                <p className="text-base text-gray-600">Uploading front image...</p>
              </div>
            ) : mutation.isSuccess ? (
              <div className="space-y-4">
                {/* <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-base text-green-600 font-medium">Front image uploaded!</p> */}
                <div className="relative group">
                  <img
                    src={croppedImageUrl.front}
                    alt="Uploaded Aadhaar Front"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-green-200 shadow-lg"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={() => handleRemoveFile('front')}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{frontFile.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={croppedImageUrl.front}
                    alt="Aadhaar Front Preview"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-gray-200 shadow-md"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={() => handleRemoveFile('front')}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base text-gray-700 font-medium">Front image ready</p>
                <p className="text-sm text-gray-600">{frontFile.name}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back Image Upload */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${
          dragActive.back
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : backFile && mutation.isSuccess
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={(e) => handleDrag(e, 'back')}
        onDragLeave={(e) => handleDrag(e, 'back')}
        onDragOver={(e) => handleDrag(e, 'back')}
        onDrop={(e) => handleDrop(e, 'back')}
      >
        {!backFile ? (
          <>
            <input
              ref={backFileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleChange(e, 'back')}
              disabled={mutation.isPending}
            />
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Upload className="h-full w-full" />
              </div>
              <p className="text-base text-gray-600 mb-2">
                <button
                  onClick={() => openFileDialog('back')}
                  className="font-medium text-blue-600 hover:text-blue-500 underline-offset-2 hover:underline"
                >
                  Click to upload
                </button>{' '}
                or drag and drop Aadhaar card (back)
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
            {mutation.isPending ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
                <p className="text-base text-gray-600">Uploading back image...</p>
              </div>
            ) : mutation.isSuccess ? (
              <div className="space-y-4">
                {/* <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-base text-green-600 font-medium">Back image uploaded!</p> */}
                <div className="relative group">
                  <img
                    src={croppedImageUrl.back}
                    alt="Uploaded Aadhaar Back"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-green-200 shadow-lg"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={() => handleRemoveFile('back')}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{backFile.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={croppedImageUrl.back}
                    alt="Aadhaar Back Preview"
                    className="w-full max-w-sm mx-auto rounded-xl border-2 border-gray-200 shadow-md"
                    style={{ aspectRatio: '3.37/2.13' }}
                  />
                  <button
                    onClick={() => handleRemoveFile('back')}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base text-gray-700 font-medium">Back image ready</p>
                <p className="text-sm text-gray-600">{backFile.name}</p>
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

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending || !frontFile || !backFile}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
            mutation.isPending || !frontFile || !backFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {mutation.isPending ? (
            <span className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            'Process Aadhaar'
          )}
        </button>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && originalFile && (
        <ImageCropper
          image={originalFile}
          onCropComplete={(blob) => handleCropComplete(blob, showCropper)}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default FileUpload;