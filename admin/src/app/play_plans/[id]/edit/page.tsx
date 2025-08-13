'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import PlayPlanForm from '@/components/forms/PlayPlanForm';
import '@/styles/play-plans.css';
import { UPDATE_PLAY_PLAN_WITH_DETAILS } from '@/graphql/mutations/updatePlanDetails';
import { GET_PLAY_PLANS } from '@/graphql/queries/getPlayPlans';
import { GET_FORM_OPTIONS } from '@/graphql/queries/getSpots';

export default function EditPlayPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: planData, loading: planLoading, error: planError } = useQuery(GET_PLAY_PLANS, {
    variables: { limit: 100 },
  });
  const { data: optionsData, loading: optionsLoading } = useQuery(GET_FORM_OPTIONS);

  const [updatePlayPlan] = useMutation(UPDATE_PLAY_PLAN_WITH_DETAILS);

  // ID の比較を文字列同士に
  const currentPlan = planData?.playPlans?.find((plan: any) => plan.id.toString() === planId);

  const transformPlanDataForForm = (plan: any) => {
    if (!plan) return null;

    return {
      planName: plan.planName || '',
      description: plan.description || '',
      status: plan.status || 'draft',
      tripType: plan.tripType || 'day_trip',
      totalBudget: plan.totalBudget?.toString() || '',
      location: plan.location || '',
      startTime: plan.startTime,
      endTime: plan.endTime,
      imageUrl: plan.imageUrl || '',
      imageUrls: plan.imageUrls || [],
      tags: plan.tags || '',
      recommendUsers: plan.recommendUsers || [],
      plannerTitle: plan.plannerTitle || '',
      plannerDescription: plan.plannerDescription || '',
      planDetails: plan.planDetails?.map((detail: any, index: number) => ({
        id: detail.id,
        stepNumber: detail.stepNumber || index + 1,
        stepName: detail.stepName || '',
        stepDescription: detail.stepDescription || '',
        spotId: detail.spot?.id || '',
        comment: detail.comment || '',
        endTime: detail.endTime,
        startTime: detail.startTime,
        durationMinutes: detail.durationMinutes,
        budget: detail.budget?.toString() || '',
        notes: detail.notes || '',
        travelDetails: detail.travelDetails?.map((travel: any) => ({
          id: travel.id,
          sequenceNumber: travel.sequenceNumber,
          travelMethod: travel.travelMethod,
          travelTime: travel.travelTime?.toString() || '',
          notes: travel.notes || '',
        })) || [],
      })) || [
          {
            stepNumber: 1,
            stepName: '',
            stepDescription: '',
            spotId: '',
            comment: '',
            startTime: '',
            durationMinutes: undefined,
            budget: '',
            notes: '',
            travelDetails: [],
          },
        ],
    };
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const result = await updatePlayPlan({
        variables: {
          input: {
            id: planId,
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
            deleteImageIds: formData.deleteImageIds,
            tags: formData.tags,
            recommendUsers: formData.recommendUsers || [],
            plannerTitle: formData.plannerTitle,
            plannerDescription: formData.plannerDescription,
            planDetails: formData.planDetails.map((detail: any) => ({
              id: detail.id || null,
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
              travelDetails: detail.travelDetails?.map((travel: any) => ({
                id: travel.id || null,
                sequenceNumber: travel.sequenceNumber,
                travelMethod: travel.travelMethod,
                travelTime: travel.travelTime ? parseInt(travel.travelTime) : null,
                notes: travel.notes,
              })) || [],
            })),
          },
        },
      });

      const payload = result.data.createOrUpdatePlayPlanWithDetails;
      if (payload?.success) {
        router.push('/play_plans');
      }
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('編集を中止してもよろしいですか？')) {
      router.push('/play_plans');
    }
  };

  if (planLoading || optionsLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (planError) {
    return <div className="p-6 text-red-600">エラー: {planError.message}</div>;
  }

  if (!currentPlan) {
    return <div className="p-6 text-red-600">プランが見つかりません</div>;
  }

  const initialData = transformPlanDataForForm(currentPlan);

  if (!initialData) {
    return <div className="p-6 text-red-600">プランデータの変換に失敗しました</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">プラン編集</h1>
        <p className="text-gray-600 mt-2">「{currentPlan.planName}」を編集します。</p>
      </div>

      <PlayPlanForm
        initialData={initialData}
        spots={optionsData?.spots || []}
        recommendedFors={optionsData?.recommendedFors || []}
        districts={optionsData?.districts || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="更新"
      />
    </div>
  );
}
