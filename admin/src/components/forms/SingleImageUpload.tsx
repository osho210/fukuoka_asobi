import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface SingleImageUploadProps {
    onImageChange: (base64Image: string | null) => void;
    onDeleteImage: () => void;
    existingImageUrl?: string | null;
    label?: string;
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
    onImageChange,
    onDeleteImage,
    existingImageUrl = null,
    label = '画像'
}) => {
    const [preview, setPreview] = useState<string | null>(existingImageUrl);
    const [hasExistingImage, setHasExistingImage] = useState<boolean>(!!existingImageUrl);

    useEffect(() => {
        setPreview(existingImageUrl);
        setHasExistingImage(!!existingImageUrl);
    }, [existingImageUrl]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setHasExistingImage(false); // 新しい画像をアップロードしたので既存画像フラグをfalseに

            // Base64に変換
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                onImageChange(reader.result as string);
            };
            reader.onerror = error => {
                console.error('ファイル読み込みエラー:', error);
            };
        }
    }, [onImageChange]);

    const handleRemoveImage = () => {
        setPreview(null);
        if (hasExistingImage) {
            // 既存画像を削除
            onDeleteImage();
        }
        setHasExistingImage(false);
        onImageChange(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: false
    });

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {preview ? (
                <div style={previewContainerStyle}>
                    <div style={previewStyle}>
                        <Image
                            src={preview || ''}
                            alt="画像プレビュー"
                            width={200}
                            height={200}
                            style={imageStyle}
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            style={deleteButtonStyle}
                            title="画像を削除"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    style={{
                        ...dropzoneStyle,
                        ...(isDragActive ? activeDropzoneStyle : {})
                    }}
                >
                    <input {...getInputProps()} />
                    <p>
                        {isDragActive
                            ? '画像をここにドロップしてください'
                            : '画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください'
                        }
                    </p>
                </div>
            )
            }
        </div >
    );
};

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.2s ease',
};

const activeDropzoneStyle: React.CSSProperties = {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff',
};

const previewContainerStyle: React.CSSProperties = {
    marginTop: '10px',
};

const previewStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
};

const deleteButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
};

const imageStyle: React.CSSProperties = {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ddd',
};

export default SingleImageUpload;
