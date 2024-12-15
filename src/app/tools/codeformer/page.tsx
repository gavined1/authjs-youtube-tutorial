'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { FiUploadCloud } from 'react-icons/fi'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ImageCompare from './components/ImageCompare'

const MAX_IMAGE_SIZE = 1024; // Maximum dimension in pixels

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_IMAGE_SIZE) {
          height = (height * MAX_IMAGE_SIZE) / width;
          width = MAX_IMAGE_SIZE;
        } else if (height > MAX_IMAGE_SIZE) {
          width = (width * MAX_IMAGE_SIZE) / height;
          height = MAX_IMAGE_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function CodeformerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageAspectRatio, setImageAspectRatio] = useState(16/9)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        const img = new Image();
        img.onload = () => {
          setImageAspectRatio(img.width / img.height);
        };
        img.src = resizedImage;
        setImage(resizedImage);
        setResult(null);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Error processing image');
      }
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const processImage = async () => {
    if (!image) return

    setLoading(true)
    try {
      // Get the base64 data without the prefix
      const base64Data = image.split(',')[1];
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success || !data.output) {
        throw new Error(data.error || 'Failed to process image');
      }

      // Validate URL format
      try {
        new URL(data.output);
      } catch {
        throw new Error('Invalid URL received from server');
      }

      setResult(data.output);
      toast.success('Image enhanced successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = useCallback(async () => {
    if (!result) return

    try {
      // Add a loading toast
      const loadingToast = toast.loading('Downloading image...');
      
      // Validate URL format
      try {
        new URL(result);
      } catch {
        throw new Error('Invalid image URL');
      }

      const response = await fetch(result);
      if (!response.ok) throw new Error('Failed to download image');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enhanced_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download image');
    }
  }, [result])

  const handleClear = useCallback(() => {
    setImage(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 group"
              aria-label="Back to Dashboard"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-300 group-hover:-translate-x-1 transition-transform duration-200" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-violet-200 text-transparent bg-clip-text">
                AI Image Enhancement
              </h1>
              <p className="text-gray-400 mt-2">
                Enhance and restore your photos using AI-powered technology
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-black/50 backdrop-blur-sm mb-8 lg:mb-0"
          >
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Upload Your Image
              </label>
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 hover:bg-black/30 transition duration-300 ease-in-out"
              >
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300">Drag & drop your image here, or click to browse</p>
                <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, and WEBP (max 5MB)</p>
              </div>
              {!result && image && (
                <button
                  onClick={processImage}
                  disabled={loading}
                  className={`mt-6 w-full flex items-center justify-center py-3 px-6 rounded-xl text-base font-medium transition duration-300 ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enhancing Image...
                    </div>
                  ) : (
                    'Enhance with AI'
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Image Preview/Result Section */}
          {image && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-black/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {result ? 'Compare Results' : 'Original Image'}
              </h3>
              <div className="relative rounded-xl overflow-hidden bg-black/30 max-h-[70vh]">
                {result ? (
                  <ImageCompare 
                    original={image} 
                    enhanced={result}
                    aspectRatio={imageAspectRatio}
                  />
                ) : (
                  <div style={{ paddingTop: `${Math.min((1 / imageAspectRatio) * 100, 100)}%` }} className="relative">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
              {result && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-black/50 text-rose-500 text-sm font-medium hover:bg-black/70 transition duration-300"
                  >
                    Clear Results
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition duration-300"
                  >
                    Download Enhanced Image
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
