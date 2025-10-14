'use client';

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

export interface ImageProperty {
  attachmentId: string;
  url: string;
  isSelected: boolean;
  position: number;
  comment?: string;
}

interface ImagePropertiesEditorProps {
  imageProperties: ImageProperty[];
  onChange: (properties: ImageProperty[]) => void;
  maxSelected?: number;
}

const ImagePropertiesEditor: React.FC<ImagePropertiesEditorProps> = ({
  imageProperties,
  onChange,
  maxSelected = 3,
}) => {
  const [properties, setProperties] = useState<ImageProperty[]>(imageProperties);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setProperties(imageProperties);
  }, [imageProperties]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(properties);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // positionを更新
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setProperties(updatedItems);
    onChange(updatedItems);
  };

  const handleToggleSelected = (attachmentId: string) => {
    const updatedProperties = properties.map((prop) => {
      if (prop.attachmentId === attachmentId) {
        const newIsSelected = !prop.isSelected;

        // 選択上限チェック
        const currentSelectedCount = properties.filter(p => p.isSelected && p.attachmentId !== attachmentId).length;
        if (newIsSelected && currentSelectedCount >= maxSelected) {
          setError(`選択できる画像は${maxSelected}枚までです。`);
          return prop;
        }

        setError('');
        return { ...prop, isSelected: newIsSelected };
      }
      return prop;
    });

    setProperties(updatedProperties);
    onChange(updatedProperties);
  };

  const handleCommentChange = (attachmentId: string, comment: string) => {
    const updatedProperties = properties.map((prop) =>
      prop.attachmentId === attachmentId ? { ...prop, comment } : prop
    );

    setProperties(updatedProperties);
    onChange(updatedProperties);
  };

  const selectedCount = properties.filter(prop => prop.isSelected).length;

  return (
    <div className="image-properties-editor">
      <div className="image-properties-editor__header">
        <h3 className="image-properties-editor__title">画像設定</h3>
        <div className="image-properties-editor__counter">
          選択中: {selectedCount}/{maxSelected}枚
        </div>
      </div>

      {error && (
        <div className="image-properties-editor__error">
          {error}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-properties">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="image-properties-editor__list"
            >
              {properties.map((property, index) => (
                <Draggable
                  key={property.attachmentId}
                  draggableId={property.attachmentId}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`image-properties-editor__item ${
                        snapshot.isDragging ? 'image-properties-editor__item--dragging' : ''
                      } ${property.isSelected ? 'image-properties-editor__item--selected' : ''}`}
                    >
                      <div className="image-properties-editor__item-content">
                        {/* ドラッグハンドル */}
                        <div
                          {...provided.dragHandleProps}
                          className="image-properties-editor__drag-handle"
                        >
                          <svg className="image-properties-editor__drag-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>

                        {/* 画像サムネイル */}
                        <div className="image-properties-editor__thumbnail">
                          <img
                            src={property.url}
                            alt={`Image ${index + 1}`}
                            className="image-properties-editor__image"
                          />
                        </div>

                        {/* コントロール */}
                        <div className="image-properties-editor__controls">
                          {/* 表示トグル */}
                          <div className="image-properties-editor__toggle">
                            <input
                              type="checkbox"
                              id={`selected-${property.attachmentId}`}
                              checked={property.isSelected}
                              onChange={() => handleToggleSelected(property.attachmentId)}
                              className="image-properties-editor__checkbox"
                            />
                            <label
                              htmlFor={`selected-${property.attachmentId}`}
                              className="image-properties-editor__toggle-label"
                            >
                              公開ページに表示する
                            </label>
                          </div>

                          {/* コメント入力 */}
                          <div className="image-properties-editor__comment-field">
                            <label
                              htmlFor={`comment-${property.attachmentId}`}
                              className="image-properties-editor__comment-label"
                            >
                              コメント（任意）
                            </label>
                            <textarea
                              id={`comment-${property.attachmentId}`}
                              value={property.comment || ''}
                              onChange={(e) => handleCommentChange(property.attachmentId, e.target.value)}
                              placeholder="画像の説明やコメントを入力..."
                              className="image-properties-editor__comment-input"
                              rows={2}
                            />
                          </div>

                          {/* 表示順 */}
                          <div className="image-properties-editor__position">
                            表示順: {index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {properties.length === 0 && (
        <div className="image-properties-editor__empty">
          画像がアップロードされていません
        </div>
      )}
    </div>
  );
};

export default ImagePropertiesEditor;
