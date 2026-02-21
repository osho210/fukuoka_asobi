import type { Meta, StoryObj } from '@storybook/nextjs';
import EditPlayPlanPage from './page';

const meta = {
  title: 'Pages/Admin/PlayPlans/Edit',
  component: EditPlayPlanPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/play_plans/[id]/edit',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditPlayPlanPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * プラン1の編集
 */
export const EditPlan1: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/play_plans/1/edit',
        query: { id: '1' },
      },
    },
  },
};

/**
 * プラン2の編集
 */
export const EditPlan2: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/play_plans/2/edit',
        query: { id: '2' },
      },
    },
  },
};
