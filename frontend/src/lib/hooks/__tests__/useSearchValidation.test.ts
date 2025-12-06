import { describe, expect, it } from 'bun:test';
import { collectValidationErrors } from '../useSearchValidation';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const createValidParams = () => ({
  date: formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  districts: ['hakata'],
  memberInfo: { recommendUsers: [1] },
  budget: { min: 0, max: 10000 },
  startTime: '10:00',
  endTime: '11:00',
});

describe('useSearchValidation.validateAll', () => {
  it('returns error when date is not selected', () => {
    const errors = collectValidationErrors({
      ...createValidParams(),
      date: '',
    });

    expect(errors.date).toBe('日付を選択してください');
  });

  it('returns error when date is in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const errors = collectValidationErrors({
      ...createValidParams(),
      date: formatDate(yesterday),
    });

    expect(errors.date).toBe('過去の日付は指定できません');
  });

  it('returns error when districts are empty', () => {
    const errors = collectValidationErrors({
      ...createValidParams(),
      districts: [],
    });

    expect(errors.districts).toBe('エリアを選択してください');
  });

  it('returns error when minimum budget exceeds maximum budget', () => {
    const errors = collectValidationErrors({
      ...createValidParams(),
      budget: { min: 2000, max: 1000 },
    });

    expect(errors.budget).toBe('最小予算が最大予算を超えています');
  });

  it('returns error when end time is earlier than or equal to start time', () => {
    const errors = collectValidationErrors({
      ...createValidParams(),
      startTime: '12:00',
      endTime: '11:30',
    });

    expect(errors.time).toBe('終了時刻は開始時刻より後に設定してください');
  });

  it('allows times without zero padding such as 9:30 and 10:00', () => {
    const errors = collectValidationErrors({
      ...createValidParams(),
      startTime: '9:30',
      endTime: '10:00',
    });

    expect(errors.time).toBeUndefined();
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
