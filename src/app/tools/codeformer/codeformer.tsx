"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiDownload, FiTrash2, FiZap, FiArrowLeft } from "react-icons/fi";
import ImageCompare from "./components/ImageCompare";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Codeformer = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEnhancedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const enhanceImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance image");
      }

      const data = await response.json();
      setEnhancedImage(data.output);
      toast.success('Image enhanced successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!enhancedImage) return;

    try {
      const response = await fetch(enhancedImage);
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
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  }, [enhancedImage]);

  const handleClear = useCallback(() => {
    setImage(null);
    setEnhancedImage(null);
    setError(null);
    toast.success('Cleared successfully!');
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-white mb-1">AI Face Enhancement</h1>
            <p className="text-sm text-slate-400">
              Enhance and restore face images using CodeFormer AI model
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Input Section */}
          <motion.div 
            className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-slate-900/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <label className="block">
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <FiUpload className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                  />
                </div>
              </label>
              
              {image && (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Input"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
                    onClick={enhanceImage}
                    disabled={!image || isProcessing}
                  >
                    <FiZap className="w-4 h-4" />
                    {isProcessing ? "Processing..." : "Enhance Image"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Output Section */}
          {(image || enhancedImage) && (
            <motion.div 
              className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-slate-900/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Result</h2>
              <div className="space-y-4">
                {enhancedImage && image ? (
                  <>
                    <ImageCompare 
                      original={image} 
                      enhanced={enhancedImage}
                      aspectRatio={1}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Download Result</span>
                      </button>
                      <button
                        onClick={handleClear}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="aspect-square w-full flex items-center justify-center border border-white/10 rounded-xl bg-white/5">
                    <p className="text-white/40">
                      {isProcessing ? "Processing..." : "Enhanced image will appear here"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div 
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Codeformer;
