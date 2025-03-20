import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';

type NewsCardProps = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  imageUrl?: string | null;
  categoryName?: string | null;
  authorName?: string | null;
};

export default function NewsCard({
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
    <Link href={`/news/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {categoryName && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
              {categoryName}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{shortBody}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formattedDate}</span>
            {authorName && <span>投稿者: {authorName}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
