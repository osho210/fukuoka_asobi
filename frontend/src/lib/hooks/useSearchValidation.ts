'use client';

import { useState } from 'react';

/**
 * バリデーションエラーの型定義
 */
export interface ValidationErrors {
  date?: string;
  districts?: string;
  memberInfo?: string;
  budget?: string;
  time?: string;
  [key: string]: string | undefined;
}

/**
 * フロントエンドでの検索パラメータバリデーションを行うカスタムフック
 * ユーザーがフォームに入力した内容を事前にチェックし、即座にフィードバックを提供する
 */
export const validateDate = (date: string): string | undefined => {
  if (!date) {
    return '日付を選択してください';
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return '過去の日付は指定できません';
  }

  return undefined;
};

/**
 * 地区のバリデーション
 * @param districts - 検証する地区の配列
 * @returns エラーメッセージ（正常な場合はundefined）
 */
export const validateDistricts = (districts: string[]): string | undefined => {
  if (!districts || districts.length === 0) {
    return 'エリアを選択してください';
  }
  return undefined;
};

/**
 * メンバー情報のバリデーション
 * @param memberInfo - 検証するメンバー情報
 * @returns エラーメッセージ（正常な場合はundefined）
 */
export const validateMemberInfo = (memberInfo: { recommendUsers: number[] }): string | undefined => {
  if (!memberInfo.recommendUsers || memberInfo.recommendUsers.length === 0) {
    return '利用メンバーを選択してください';
  }
  return undefined;
};

/**
 * 予算のバリデーション
 * @param budget - 検証する予算情報
 * @returns エラーメッセージ（正常な場合はundefined）
 */
export const validateBudget = (budget: { min: number; max: number }): string | undefined => {
  if (budget.min < 0 || budget.max < 0) {
    return '予算は0以上で指定してください';
  }

  if (budget.min > budget.max) {
    return '最小予算が最大予算を超えています';
  }

  return undefined;
};

/**
 * 時刻の文字列を分に変換
 * 例: "9:30" -> 570
 */
const parseTimeToMinutes = (time?: string): number | undefined => {
  if (!time) return undefined;

  const [hours, minutes] = time.split(':');
  const hoursNum = Number(hours);
  const minutesNum = Number(minutes);

  if (Number.isNaN(hoursNum) || Number.isNaN(minutesNum)) return undefined;

  return hoursNum * 60 + minutesNum;
};

/**
 * 時刻のバリデーション
 * @param startTime - 開始時刻
 * @param endTime - 終了時刻
 * @returns エラーメッセージ（正常な場合はundefined）
 */
export const validateTime = (startTime?: string, endTime?: string): string | undefined => {
  if (startTime && endTime) {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);

    if (startMinutes !== undefined && endMinutes !== undefined && endMinutes <= startMinutes) {
      return '終了時刻は開始時刻より後に設定してください';
    }
  }
  return undefined;
};

export const collectValidationErrors = (params: {
  date: string;
  districts: string[];
  memberInfo: { recommendUsers: number[] };
  budget: { min: number; max: number };
  startTime?: string;
  endTime?: string;
}): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  const dateError = validateDate(params.date);
  if (dateError) newErrors.date = dateError;

  const districtsError = validateDistricts(params.districts);
  if (districtsError) newErrors.districts = districtsError;

  const memberInfoError = validateMemberInfo(params.memberInfo);
  if (memberInfoError) newErrors.memberInfo = memberInfoError;

  const budgetError = validateBudget(params.budget);
  if (budgetError) newErrors.budget = budgetError;

  const timeError = validateTime(params.startTime, params.endTime);
  if (timeError) newErrors.time = timeError;

  return newErrors;
};

export const useSearchValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * すべての検索パラメータをバリデーション
   * @param params - 検証する検索パラメータ
   * @returns バリデーション結果（エラーがない場合はtrue）
   */
  const validateAll = (params: {
    date: string;
    districts: string[];
    memberInfo: { recommendUsers: number[] };
    budget: { min: number; max: number };
    startTime?: string;
    endTime?: string;
  }): boolean => {
    const newErrors = collectValidationErrors(params);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 特定のフィールドのエラーをクリア
   * @param field - クリアするフィールド名
   */
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  /**
   * すべてのエラーをクリア
   */
  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateDate,
    validateDistricts,
    validateMemberInfo,
    validateBudget,
    validateTime,
    validateAll,
    clearError,
    clearAllErrors,
  };
};
