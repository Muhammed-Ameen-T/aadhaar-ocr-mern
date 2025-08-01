import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Check, X, RotateCcw, Move } from 'lucide-react';

// Aadhaar card dimensions (aspect ratio approximately 1.58:1)
const AADHAAR_ASPECT_RATIO = 3.37 / 2.13;

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  image: File;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 300, height: 190 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 300 });

  // Create image URL
  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Initialize crop area when image loads
  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    // Set container size
    const maxWidth = 400;
    const maxHeight = 300;
    
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    let displayWidth = maxWidth;
    let displayHeight = maxWidth / imgAspectRatio;
    
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * imgAspectRatio;
    }
    
    setCanvasDimensions({ width: displayWidth, height: displayHeight });
    
    // Initialize crop area (80% of smaller dimension)
    const cropSize = Math.min(displayWidth, displayHeight) * 0.7;
    const cropWidth = cropSize;
    const cropHeight = cropSize / AADHAAR_ASPECT_RATIO;
    
    setCropArea({
      x: (displayWidth - cropWidth) / 2,
      y: (displayHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });
    
    setImageLoaded(true);
  }, []);

  // Draw on main canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area (make it visible)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Draw crop border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw corner handles
    const handleSize = 10;
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
  }, [cropArea, imageLoaded, canvasDimensions]);

  // Generate preview
  const updatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const img = imageRef.current;
    if (!previewCanvas || !img || !imageLoaded) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    // Set preview canvas size
    const previewWidth = 200;
    const previewHeight = previewWidth / AADHAAR_ASPECT_RATIO;
    previewCanvas.width = previewWidth;
    previewCanvas.height = previewHeight;

    // Calculate scale factors
    const scaleX = img.naturalWidth / canvasDimensions.width;
    const scaleY = img.naturalHeight / canvasDimensions.height;

    // Draw cropped image to preview
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      previewWidth,
      previewHeight
    );
  }, [cropArea, imageLoaded, canvasDimensions]);

  // Update canvas and preview when crop area changes
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
      updatePreview();
    }
  }, [drawCanvas, updatePreview, imageLoaded]);

  // Check if point is within a handle
  const isPointInHandle = (x: number, y: number, handleX: number, handleY: number, handleSize: number) => {
    return (
      x >= handleX - handleSize / 2 &&
      x <= handleX + handleSize / 2 &&
      y >= handleY - handleSize / 2 &&
      y <= handleY + handleSize / 2
    );
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const handleSize = 10;

    // Check for resize handles
    if (isPointInHandle(x, y, cropArea.x, cropArea.y, handleSize)) {
      setIsResizing(true);
      setResizeHandle('top-left');
      canvas.style.cursor = 'nwse-resize';
    } else if (isPointInHandle(x, y, cropArea.x + cropArea.width, cropArea.y, handleSize)) {
      setIsResizing(true);
      setResizeHandle('top-right');
      canvas.style.cursor = 'nesw-resize';
    } else if (isPointInHandle(x, y, cropArea.x, cropArea.y + cropArea.height, handleSize)) {
      setIsResizing(true);
      setResizeHandle('bottom-left');
      canvas.style.cursor = 'nesw-resize';
    } else if (isPointInHandle(x, y, cropArea.x + cropArea.width, cropArea.y + cropArea.height, handleSize)) {
      setIsResizing(true);
      setResizeHandle('bottom-right');
      canvas.style.cursor = 'nwse-resize';
    } else if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      // Drag the crop area
      setIsDragging(true);
      setDragOffset({
        x: x - cropArea.x,
        y: y - cropArea.y
      });
      canvas.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const handleSize = 10;
    const minSize = 50; // Minimum crop size

    if (isResizing && resizeHandle) {
      let newX = cropArea.x;
      let newY = cropArea.y;
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;

      if (resizeHandle === 'top-left') {
        const deltaX = x - cropArea.x;
        // const deltaY = deltaX / AADHAAR_ASPECT_RATIO;
        newWidth = cropArea.width - deltaX;
        newHeight = newWidth / AADHAAR_ASPECT_RATIO;
        newX = x;
        newY = cropArea.y + cropArea.height - newHeight;
      } else if (resizeHandle === 'top-right') {
        newWidth = x - cropArea.x;
        newHeight = newWidth / AADHAAR_ASPECT_RATIO;
        newY = cropArea.y + cropArea.height - newHeight;
      } else if (resizeHandle === 'bottom-left') {
        const deltaX = x - cropArea.x;
        // const deltaY = deltaX / AADHAAR_ASPECT_RATIO;
        newWidth = cropArea.width - deltaX;
        newHeight = newWidth / AADHAAR_ASPECT_RATIO;
        newX = x;
      } else if (resizeHandle === 'bottom-right') {
        newWidth = x - cropArea.x;
        newHeight = newWidth / AADHAAR_ASPECT_RATIO;
      }

      // Enforce minimum and maximum bounds
      newWidth = Math.max(minSize, Math.min(newWidth, canvas.width - newX));
      newHeight = newWidth / AADHAAR_ASPECT_RATIO;

      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + newWidth > canvas.width) {
        newWidth = canvas.width - newX;
        newHeight = newWidth / AADHAAR_ASPECT_RATIO;
      }
      if (newY + newHeight > canvas.height) {
        newHeight = canvas.height - newY;
        newWidth = newHeight * AADHAAR_ASPECT_RATIO;
        newX = cropArea.x + cropArea.width - newWidth;
      }

      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    } else if (isDragging) {
      const newX = Math.max(0, Math.min(x - dragOffset.x, canvas.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragOffset.y, canvas.height - cropArea.height));

      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else {
      // Update cursor based on hover
      if (isPointInHandle(x, y, cropArea.x, cropArea.y, handleSize)) {
        canvas.style.cursor = 'nwse-resize';
      } else if (isPointInHandle(x, y, cropArea.x + cropArea.width, cropArea.y, handleSize)) {
        canvas.style.cursor = 'nesw-resize';
      } else if (isPointInHandle(x, y, cropArea.x, cropArea.y + cropArea.height, handleSize)) {
        canvas.style.cursor = 'nesw-resize';
      } else if (isPointInHandle(x, y, cropArea.x + cropArea.width, cropArea.y + cropArea.height, handleSize)) {
        canvas.style.cursor = 'nwse-resize';
      } else if (
        x >= cropArea.x &&
        x <= cropArea.x + cropArea.width &&
        y >= cropArea.y &&
        y <= cropArea.y + cropArea.height
      ) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  };

  // Reset crop area to center
  const resetCropArea = () => {
    const cropSize = Math.min(canvasDimensions.width, canvasDimensions.height) * 0.7;
    const cropWidth = cropSize;
    const cropHeight = cropSize / AADHAAR_ASPECT_RATIO;
    
    setCropArea({
      x: (canvasDimensions.width - cropWidth) / 2,
      y: (canvasDimensions.height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });
  };

  // Complete crop and return blob
  const handleCropComplete = () => {
    const img = imageRef.current;
    if (!img || !imageLoaded) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scale factors for full resolution
    const scaleX = img.naturalWidth / canvasDimensions.width;
    const scaleY = img.naturalHeight / canvasDimensions.height;

    // Set output canvas size (maintain aspect ratio, reasonable size)
    const outputWidth = 600;
    const outputHeight = outputWidth / AADHAAR_ASPECT_RATIO;
    
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw cropped image at high quality
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Crop Aadhaar Card</h3>
              <p className="text-sm text-gray-600 mt-1">Position and resize the frame over your Aadhaar card</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Main cropping area */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-gray-200 rounded-xl"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Original"
                  className="hidden"
                  onLoad={handleImageLoad}
                />
              </div>
            </div>

            {/* Preview and controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                  <canvas
                    ref={previewCanvasRef}
                    className="border border-gray-300 rounded-lg shadow-sm"
                    style={{ maxWidth: '120px' }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={resetCropArea}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Move className="h-3 w-3" />
                    <span>Drag to move, drag corners to resize</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  disabled={!imageLoaded}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Apply Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;