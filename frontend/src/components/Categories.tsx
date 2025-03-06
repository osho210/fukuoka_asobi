'use client';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries/getCategories';

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Categories() {
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>カテゴリー一覧</h2>
      <ul>
        {data?.categories.map((category: Category) => (
          <li key={category.id}>
            {category.name} (作成日: {new Date(category.createdAt).toLocaleDateString('ja-JP')})
          </li>
        ))}
      </ul>
    </div>
  );
}
