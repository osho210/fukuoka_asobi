'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import PlayPlanForm from '@/components/forms/PlayPlanForm';
import { GET_FORM_OPTIONS } from '@/graphql/queries/getSpots';
import '@/styles/play-plans.css';
import { UPDATE_PLAY_PLAN_WITH_DETAILS } from '@/graphql/mutations/updatePlanDetails';

export default function NewPlayPlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [upsertPlayPlan] = useMutation(UPDATE_PLAY_PLAN_WITH_DETAILS);


  const { data: optionsData, loading: optionsLoading } = useQuery(GET_FORM_OPTIONS);


  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const result = await upsertPlayPlan({
        variables: {
          input: {
            planName: formData.planName,
            description: formData.description,
            status: formData.status?.toUpperCase(),
            tripType: formData.tripType?.toUpperCase(),
            totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : null,
            location: formData.location,
            startTime: formData.startTime,
            endTime: formData.endTime,
            imageUrl: formData.imageUrl,
            images: formData.newImages,
            tags: formData.tags,
            recommendUsers: formData.recommendUsers || [],
            planDetails: formData.planDetails.map((detail: any) => ({
              stepNumber: detail.stepNumber,
              stepName: detail.stepName,
              stepDescription: detail.stepDescription,
              spotId: detail.spotId || null,
              comment: detail.comment,
              startTime: detail.startTime,
              endTime: detail.endTime,
              durationMinutes: detail.durationMinutes,
              budget: detail.budget ? parseFloat(detail.budget) : null,
              notes: detail.notes,
              travelDetails:
                detail.travelDetails?.map((travel: any) => ({
                  sequenceNumber: travel.sequenceNumber,
                  travelMethod: travel.travelMethod,
                  travelTime: travel.travelTime ? parseInt(travel.travelTime, 10) : null,
                  notes: travel.notes,
                })) || [],
            })),
          },
        },
      });

      const payload = result.data?.updatePlayPlanWithDetails;
      if (payload?.success) {
        alert('プランを作成しました');
        router.push('/play_plans');
      } else {
        const errors = payload?.errors || [];
        alert(
          `エラーが発生しました:\n` +
          errors.map((e: any) => `${e.field}: ${e.message}`).join('\n')
        );
      }
    } catch (e) {
      console.error('作成エラー:', e);
      alert('作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('作成を中止してもよろしいですか？')) {
      router.push('/play_plans');
    }
  };

  if (optionsLoading) {
    return <div className="p-6">読み込み中...</div>;
  }
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新規プラン作成</h1>
        <p className="text-gray-600 mt-2">新しい遊びプランを作成します。</p>
      </div>

      <PlayPlanForm
        initialData={{
          planName: '',
          description: '',
          status: 'draft',
          tripType: 'day_trip',
          totalBudget: '',
          location: '',
          startTime: '',
          endTime: '',
          imageUrl: '',
          tags: '',
          recommendUsers: [],
          planDetails: [
            {
              stepNumber: 1,
              stepName: '',
              stepDescription: '',
              spotId: '',
              comment: '',
              startTime: '',
              durationMinutes: 60,
              budget: '',
              notes: '',
              travelDetails: [],
            },
          ],
        }}
        spots={optionsData?.spots || []}
        recommendedFors={optionsData?.recommendedFors || []}
        districts={optionsData?.districts || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="作成"
      />
    </div>
  );
}
