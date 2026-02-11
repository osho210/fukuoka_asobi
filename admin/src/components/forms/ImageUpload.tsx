import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

// バックエンドから受け取る画像の型
interface ExistingImage {
    id: string;
    url: string;
}

// 新規画像を管理する型
interface NewImagePreview {
    id: string;
    preview: string;
    base64: string;
}

interface ImageUploadProps {
    onImagesChange: (base64Images: string[]) => void;
    onDeleteImage: (id: string) => void; // 削除用コールバック
    existingImages?: ExistingImage[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, onDeleteImage, existingImages = [] }) => {
    const [newPreviews, setNewPreviews] = useState<NewImagePreview[]>([]);
    const [currentImages, setCurrentImages] = useState<ExistingImage[]>(existingImages);

    useEffect(() => {
        setCurrentImages(existingImages);
    }, [existingImages]);

    /**
     * 新規画像の追加時にすべてのBase64画像をコールバックに渡す
     * @param images - 新規画像プレビューの配列
     */
    const notifyImagesChange = useCallback((images: NewImagePreview[]) => {
        const base64Images = images.map(img => img.base64);
        onImagesChange(base64Images);
    }, [onImagesChange]);

    // newPreviewsが更新されたら親コンポーネントに通知
    useEffect(() => {
        notifyImagesChange(newPreviews);
    }, [newPreviews, notifyImagesChange]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newBase64Promises: Promise<NewImagePreview>[] = [];

        acceptedFiles.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            newBase64Promises.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        resolve({
                            id: `new-${Date.now()}-${Math.random()}`,
                            preview: previewUrl,
                            base64: reader.result as string,
                        });
                    };
                    reader.onerror = error => reject(error);
                })
            );
        });

        Promise.all(newBase64Promises).then((newImages) => {
            setNewPreviews(prev => [...prev, ...newImages]);
        });
    }, []);

    /**
     * 既存画像を削除する
     * @param id - 画像ID
     */
    const handleRemoveExistingImage = (id: string) => {
        setCurrentImages(prev => prev.filter(image => image.id !== id));
        onDeleteImage(id);
    };

    /**
     * 新規画像を削除する
     * @param id - 新規画像ID
     */
    const handleRemoveNewImage = (id: string) => {
        setNewPreviews(prev => prev.filter(img => img.id !== id));
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
            {currentImages.length > 0 && (
                <div>
                    <h4 className="play-plan-form__label">既存画像</h4>
                    <div className='preview-image-container'>
                        {currentImages.map((image, index) => (
                            <div key={image.id} style={previewStyle}>
                                <Image src={image.url} alt={`Existing ${index}`} width={150} height={150} style={imageStyle} />
                                <button onClick={() => handleRemoveExistingImage(image.id)} style={deleteButtonStyle} type="button">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ドラッグ＆ドロップエリア */}
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください</p>
                <small>複数ファイルの選択に対応しています</small>
            </div>

            {/* 新規画像プレビュー */}
            {newPreviews.length > 0 && (
                <div>
                    <h4 className="play-plan-form__label">新規画像（{newPreviews.length}件）</h4>
                    <div style={previewContainerStyle}>
                        {newPreviews.map((image) => (
                            <div key={image.id} style={previewStyle}>
                                <Image src={image.preview} alt="New preview" width={150} height={150} style={imageStyle} />
                                <button onClick={() => handleRemoveNewImage(image.id)} style={deleteButtonStyle} type="button">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.3s',
};

const previewContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px',
    gap: '10px',
};

const previewStyle: React.CSSProperties = {
    position: 'relative',
};

const deleteButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    padding: '0',
    fontSize: '16px',
    fontWeight: 'bold',
};

const imageStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ddd',
};

export default ImageUpload;
