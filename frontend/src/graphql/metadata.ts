// メタデータ取得用の最小限のGraphQLクエリ

export const GET_PLAY_PLAN_METADATA = `
  query GetPlayPlanMetadata($id: Int!) {
    playPlan(id: $id) {
      id
      planName
      isPublic
    }
  }
`;

export const GET_SPOT_METADATA = `
  query GetSpotMetadata($id: ID!) {
    spot(id: $id) {
      id
      spotName
      isPublic
    }
  }
`;
