import { gql } from '@apollo/client';

// ダッシュボード用統計クエリ
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      spotsCount
      areasCount
      categoriesCount
      playPlansCount
      eventsCount
      newsCount
    }
  }
`;

// ダッシュボード統計のモックデータ
export const mockDashboardStats = {
  dashboardStats: {
    spotsCount: 150,
    areasCount: 12,
    categoriesCount: 25,
    playPlansCount: 45,
    eventsCount: 30,
    newsCount: 100,
  },
};

// 空のデータ（初期状態）
export const emptyDashboardStats = {
  dashboardStats: {
    spotsCount: 0,
    areasCount: 0,
    categoriesCount: 0,
    playPlansCount: 0,
    eventsCount: 0,
    newsCount: 0,
  },
};
