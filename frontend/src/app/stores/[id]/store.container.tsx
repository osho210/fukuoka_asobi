import { useQuery } from '@apollo/client';
import { GET_STORE } from '../../../graphql/queries/getStore';
import { Store } from '../../../types/store';
import StorePresenter from './presenter';

interface StoreDetailProps {
  storeId: string;
}

interface StoreData {
  store: Store;
}

export default function StoreDetail({ storeId }: StoreDetailProps) {
  const { loading, error, data } = useQuery<StoreData>(GET_STORE, {
    variables: { id: storeId },
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.store) return <p>店舗が見つかりません</p>;

  const { store } = data;

  return <StorePresenter store={store} />
}
