import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';

type NewsCardProps = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  imageUrl?: string | null;
  categoryName?: string | null;
  authorName?: string | null;
};

function NewsCard({
  id,
  title,
  body,
  publishedAt,
  imageUrl,
  categoryName,
  authorName,
}: NewsCardProps) {
  // 本文の短縮表示（100文字まで）
  const shortBody = body.length > 100 ? `${body.substring(0, 100)}...` : body;

  // 日付のフォーマット
  const formattedDate = publishedAt
    ? format(new Date(publishedAt), 'yyyy年MM月dd日', { locale: ja })
    : '';

  return (
    <Link href={`/news/${id}`} className="news-card-link">
      <div className="news-card">
        <div className="news-card-image-container">
          {imageUrl ? (
            <Image
              src={imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`}
              alt={title}
              fill
              className="news-card-image"
            />
          ) : (
            <div className="news-card-no-image">
              <span className="news-card-no-image-text">No Image</span>
            </div>
          )}
          {categoryName && (
            <span className="news-card-category">
              {categoryName}
            </span>
          )}
        </div>
        <div className="news-card-content">
          <h3 className="news-card-title">{title}</h3>
          <p className="news-card-body">{shortBody}</p>
          <div className="news-card-footer">
            <span>{formattedDate}</span>
            {authorName && <span>投稿者: {authorName}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(NewsCard);
