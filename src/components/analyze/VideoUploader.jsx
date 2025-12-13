
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Video, Image as ImageIcon, FileVideo, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getVideoDuration, MIN_VIDEO_DURATION_SECONDS, MAX_VIDEO_DURATION_SECONDS } from "../utils/validation";

// Constants for file validation
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_FILE_SIZE_MB_DISPLAY = 100;

// Image compression constants
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;
const IMAGE_QUALITY = 0.85;

// Image compression utility
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_IMAGE_WIDTH) {
            height = (height * MAX_IMAGE_WIDTH) / width;
            width = MAX_IMAGE_WIDTH;
          }
        } else {
          if (height > MAX_IMAGE_HEIGHT) {
            width = (width * MAX_IMAGE_HEIGHT) / height;
            height = MAX_IMAGE_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg', // Force JPEG for better compression and wider support
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          IMAGE_QUALITY
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function VideoUploader({ videoFile, onVideoSelect, onMediaSelect, isAnalyzing }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [internalFile, setInternalFile] = useState(null);
  const [error, setError] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Whitelist of accepted file types
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/avi'];
  const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

  useEffect(() => {
    if (videoFile && videoFile !== internalFile) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const newPreview = URL.createObjectURL(videoFile);
      setPreview(newPreview);
      setInternalFile(videoFile);
    } else if (!videoFile && internalFile) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setInternalFile(null);
      setError(null);
    }
  }, [videoFile, internalFile, preview]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = async (file) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file format. Please upload JPG, PNG, MP4, MOV, AVI, or WebM files only.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is ${MAX_FILE_SIZE_MB_DISPLAY}MB.`);
      return false;
    }

    if (file.type.startsWith('video/')) {
      try {
        const duration = await getVideoDuration(file);

        if (duration < MIN_VIDEO_DURATION_SECONDS) {
          setError(`Video must be at least ${MIN_VIDEO_DURATION_SECONDS} second${MIN_VIDEO_DURATION_SECONDS > 1 ? 's' : ''} long.`);
          return false;
        }

        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          const maxMinutes = Math.floor(MAX_VIDEO_DURATION_SECONDS / 60);
          const currentMinutes = Math.floor(duration / 60);
          setError(`Video must be shorter than ${maxMinutes} minute${maxMinutes > 1 ? 's' : ''}. Your video is ${currentMinutes} minute${currentMinutes > 1 ? 's' : ''} long.`);
          return false;
        }
      } catch (err) {
        console.error("Error checking video duration:", err);
        setError("Could not validate video. Please try a different file.");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const isValid = await validateFile(file);
    if (!isValid) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setInternalFile(null);
      return;
    }

    let processedFile = file;

    // Compress images automatically
    if (file.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const originalSize = (file.size / 1024).toFixed(0);
        processedFile = await compressImage(file);
        const compressedSize = (processedFile.size / 1024).toFixed(0);
        console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
        processedFile = file; // Fallback to original file if compression fails
      } finally {
        setIsCompressing(false);
      }
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    const newPreview = URL.createObjectURL(processedFile);
    setPreview(newPreview);
    setInternalFile(processedFile);

    if (onMediaSelect) {
      onMediaSelect(processedFile);
    } else if (onVideoSelect) {
      onVideoSelect(processedFile);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isAnalyzing || isCompressing) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnalyzing && !isCompressing) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileChange(file);
    }
    e.target.value = null;
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setInternalFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onMediaSelect) {
      onMediaSelect(null);
    } else if (onVideoSelect) {
      onVideoSelect(null);
    }
  };

  const handleClick = () => {
    if (!isAnalyzing && !isCompressing) {
      fileInputRef.current?.click();
    }
  };

  const isImage = videoFile?.type?.startsWith('image/');
  const isVideo = videoFile?.type?.startsWith('video/');

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error-alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isCompressing && (
            <motion.div
              key="compressing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Optimizing image for faster upload...</span>
              </div>
            </motion.div>
          )}

          {(videoFile || preview) ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {isImage ? (
                      <ImageIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    ) : (
                      <FileVideo className="w-6 h-6 text-white" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {videoFile?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(videoFile?.size / 1024 / 1024).toFixed(2)} MB
                      {isImage && ' • Image'}
                      {isVideo && ' • Video'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="text-red-600 hover:bg-red-50 flex-shrink-0"
                  aria-label="Remove file"
                  disabled={isAnalyzing || isCompressing}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {isVideo && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Video Upload:</strong> Your video will be processed frame-by-frame for comprehensive behavior analysis. Videos up to {Math.floor(MAX_VIDEO_DURATION_SECONDS / 60)} minutes are supported.
                  </p>
                </div>
              )}

              {(isImage || isVideo) && preview && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {isVideo ? (
                    <video
                      src={preview}
                      controls
                      className="w-full h-full object-contain"
                      onError={() => setError("Could not load video preview. The file might be corrupted.")}
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview of uploaded image"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={() => setError("Could not load image preview. The file might be corrupted.")}
                    />
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                  : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
              } ${isAnalyzing || isCompressing ? 'opacity-50 !cursor-not-allowed pointer-events-none' : ''}`}
              role="button"
              tabIndex={isAnalyzing || isCompressing ? -1 : 0}
              aria-label="Upload media file"
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isAnalyzing && !isCompressing) {
                  e.preventDefault();
                  handleClick();
                }
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  dragActive
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 scale-110'
                    : 'bg-gradient-to-br from-purple-500 to-blue-500'
                }`}>
                  <Upload className="w-8 h-8 md:w-10 md:h-10 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {dragActive ? 'Drop your file here' : 'Upload Photo or Video'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" aria-hidden="true" />
                      <span>JPG, PNG</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" aria-hidden="true" />
                      <span>MP4, MOV, AVI, WebM</span>
                    </div>
                    <span>•</span>
                    <span>Max {MAX_FILE_SIZE_MB_DISPLAY}MB</span>
                    <span>•</span>
                    <span>Videos: {MIN_VIDEO_DURATION_SECONDS}s - {Math.floor(MAX_VIDEO_DURATION_SECONDS / 60)} minutes</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={isAnalyzing || isCompressing}
                >
                  Browse Files
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.mp4,.mov,.webm,.avi"
                onChange={handleInputChange}
                className="hidden"
                aria-label="File upload input"
                disabled={isAnalyzing || isCompressing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
