import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
    onImagesChange: (base64Images: string[]) => void;
    existingImages?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, existingImages = [] }) => {
    const [previews, setPreviews] = useState<string[]>(existingImages);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews: string[] = [];
        const base64Promises: Promise<string>[] = [];

        acceptedFiles.forEach(file => {
            newPreviews.push(URL.createObjectURL(file));
            base64Promises.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                })
            );
        });

        setPreviews(prev => [...prev, ...newPreviews]);

        Promise.all(base64Promises).then(base64Images => {
            onImagesChange(base64Images);
        });

    }, [onImagesChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        }
    });

    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください</p>
            </div>
            <div style={previewContainerStyle}>
                {previews.map((preview, index) => (
                    <div key={index} style={previewStyle}>
                        <img src={preview} alt={`Preview ${index}`} style={imageStyle} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const previewContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px',
};

const previewStyle: React.CSSProperties = {
    position: 'relative',
    margin: '10px',
};

const imageStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
};

export default ImageUpload;
