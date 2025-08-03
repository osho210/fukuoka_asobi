import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

// バックエンドから受け取る画像の型
interface ExistingImage {
    id: string;
    url: string;
}

interface ImageUploadProps {
    onImagesChange: (base64Images: string[]) => void;
    onDeleteImage: (id: string) => void; // 削除用コールバック
    existingImages?: ExistingImage[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, onDeleteImage, existingImages = [] }) => {
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [currentImages, setCurrentImages] = useState<ExistingImage[]>(existingImages);

    useEffect(() => {
        setCurrentImages(existingImages);
    }, [existingImages]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newBase64Promises: Promise<string>[] = [];

        acceptedFiles.forEach(file => {
            setNewPreviews(prev => [...prev, URL.createObjectURL(file)]);
            newBase64Promises.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                })
            );
        });

        Promise.all(newBase64Promises).then(base64Images => {
            onImagesChange(base64Images);
        });

    }, [onImagesChange]);

    const handleRemoveExistingImage = (id: string) => {
        setCurrentImages(prev => prev.filter(image => image.id !== id));
        onDeleteImage(id);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        }
    });

    return (
        <div>
            {/* 既存の画像プレビュー */}
            {currentImages.map((image) => (
                <div key={image.id} style={previewStyle}>
                    <img src={`/api/proxy-image?url=${encodeURIComponent(image.url)}`} alt={`Existing image ${image.id}`} style={imageStyle} />
                    <button onClick={() => handleRemoveExistingImage(image.id)} style={deleteButtonStyle}>×</button>
                </div>
            ))}
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください</p>
            </div>
            <div style={previewContainerStyle}>
                {/* 新しく追加された画像プレビュー */}
                {newPreviews.map((preview, index) => (
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

const deleteButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '20px',
    padding: '0',
};

const imageStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
};

export default ImageUpload;
