/**
 * Storybook用GraphQLモックヘルパー
 * Apollo Clientのモッキングを簡単に設定するためのユーティリティ
 */

import { DocumentNode } from 'graphql';

// モックのリクエスト定義の型
export interface MockRequest {
  query: DocumentNode;
  variables?: Record<string, unknown>;
}

// モックのレスポンス定義の型
export interface MockResult<T = unknown> {
  data?: T;
  errors?: readonly { message: string }[];
}

// MockedProviderで使用するモックの型
export interface GraphQLMock<T = unknown> {
  request: MockRequest;
  result: MockResult<T>;
  delay?: number;
}

/**
 * GraphQLモックを作成するヘルパー関数
 */
export function createMock<T = unknown>(
  query: DocumentNode,
  result: T,
  variables?: Record<string, unknown>,
  delay?: number
): GraphQLMock<T> {
  return {
    request: {
      query,
      ...(variables && { variables }),
    },
    result: {
      data: result,
    },
    ...(delay && { delay }),
  };
}

/**
 * エラー状態のモックを作成するヘルパー関数
 */
export function createErrorMock(
  query: DocumentNode,
  errorMessage: string,
  variables?: Record<string, unknown>
): GraphQLMock {
  return {
    request: {
      query,
      ...(variables && { variables }),
    },
    result: {
      errors: [{ message: errorMessage }],
    },
  };
}

/**
 * ローディング状態をシミュレートするモックを作成するヘルパー関数
 * delayを長く設定することでローディング状態を維持
 */
export function createLoadingMock<T = unknown>(
  query: DocumentNode,
  result: T,
  variables?: Record<string, unknown>,
  delay: number = 2500
): GraphQLMock<T> {
  return createMock(query, result, variables, delay);
}
