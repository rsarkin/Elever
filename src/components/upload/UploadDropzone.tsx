import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, FileCheck } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  selectedFile: File | null;
  uploadProgress?: number; // 0-100
  isUploading?: boolean;
  error?: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelected,
  onRemoveFile,
  selectedFile,
  uploadProgress = 0,
  isUploading = false,
  error = null,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndPassFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndPassFile(file);
    }
  };

  const validateAndPassFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const validExts = ['.jsf', '.xtf', '.sdf', '.dat', '.png', '.jpg', '.jpeg'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
      alert('Unsupported file format. Please upload side-scan sonar images (.png, .jpg) or acoustic raw datasets (.jsf, .xtf, .sdf, .dat).');
      return;
    }
    onFileSelected(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        className="hidden"
      />

      {!selectedFile ? (
        /* Empty Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-sky-500 bg-sky-50 scale-[1.005]'
              : 'border-sand-300 bg-sand-50/60 hover:border-sand-400 hover:bg-sand-100/50'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-sand-900 mb-1">
            Drop side-scan sonar imagery here
          </h3>
          <p className="text-xs text-sand-600 max-w-sm mb-4">
            Supports PNG, JPG, JPEG sonar waterfall exports (Up to 50MB per file)
          </p>

          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold bg-white hover:bg-sand-50 text-sand-800 rounded-lg border border-sand-200 transition-colors font-mono shadow-xs"
          >
            Browse files
          </button>
        </div>
      ) : (
        /* Selected File Card */
        <div className="bg-white border border-sand-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-sand-900 truncate font-mono">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-sand-600 font-mono mt-0.5">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Ready for analysis
                  </span>
                </div>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={onRemoveFile}
                title="Remove File"
                className="p-2 rounded-lg bg-sand-50 hover:bg-rose-50 text-sand-600 hover:text-rose-700 border border-sand-200 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mt-4 pt-3 border-t border-sand-200">
              <div className="flex justify-between text-xs font-mono text-sand-600 mb-1.5">
                <span>Uploading sonar file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden border border-sand-200">
                <div
                  className="bg-sky-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
