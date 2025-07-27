'use client';

import { useState } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  onRemove: () => void;
  fileName: string | null;
  label?: string;
  required?: boolean;
  error?: string;
}

export function FileUpload({ onUpload, onRemove, fileName, label = 'ファイルアップロード', required = false, error }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onUpload(file);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="admin-form-group">
      <label className="admin-form-label">
        {label}
        {required && <span className="admin-text-red-500 admin-ml-1">*</span>}
      </label>
      <div className="admin-mt-1 admin-flex admin-items-center admin-gap-4">
        <div className="admin-flex-grow">
          {fileName ? (
            <div className="admin-flex admin-items-center admin-justify-between admin-p-2 admin-border admin-rounded-md">
              <div className="admin-flex admin-items-center admin-gap-2">
                <FileIcon className="admin-h-5 admin-w-5 admin-text-gray-500" />
                <span className="admin-text-sm">{fileName}</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
                <X className="admin-h-4 admin-w-4" />
              </Button>
            </div>
          ) : (
            <div className="admin-relative">
              <input
                type="file"
                id="file-upload"
                className="admin-hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="admin-cursor-pointer admin-flex admin-items-center admin-justify-center admin-w-full admin-p-2 admin-border-2 admin-border-dashed admin-rounded-md hover:admin-bg-gray-50"
              >
                <Upload className="admin-h-5 admin-w-5 admin-mr-2" />
                <span>{isUploading ? 'アップロード中...' : 'ファイルを選択'}</span>
              </label>
            </div>
          )}
        </div>
      </div>
      {error && <p className="admin-text-red-500 admin-text-sm admin-mt-1">{error}</p>}
    </div>
  );
}
