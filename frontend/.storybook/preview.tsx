import type { Preview } from '@storybook/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from '../src/components/common/ToastContext';
import '../src/app/globals.css';
import '../src/styles/CommonStyle.css';
import '../src/styles/AboutPage.css';
import '../src/styles/AreaMap.css';
import '../src/styles/Button.css';
import '../src/styles/DatePicker.css';
import '../src/styles/GeneratedPlan.css';
import '../src/styles/MyPageTabs.css';
import '../src/styles/PlanTimeline.css';
import '../src/styles/ProfileEditor.css';
import '../src/styles/RangeSlider.css';
import '../src/styles/RouteMap.css';
import '../src/styles/SearchForm.css';
import '../src/styles/SubscriptionStatus.css';
import '../src/styles/TabSelector.css';
import '../src/styles/UserBookmarks.css';
import '../src/styles/UserComponents.css';
import '../src/styles/UserPlayPlans.css';
import '../src/styles/Auth.css';
import '../src/styles/BusinessHour.css';
import '../src/styles/ContentDetail.css';
import '../src/styles/EventsPage.css';
import '../src/styles/HamburgerMenu.css';
import '../src/styles/NewsPage.css';
import '../src/styles/PlayPlanDetail.css';
import '../src/styles/PlayPlanList.css';
import '../src/styles/RecommendedEvent.css';
import '../src/styles/RecommendedNews.css';
import '../src/styles/RecommendedSpot.css';
import '../src/styles/SpotsPage.css';



const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, context) => {
      // storyのパラメータからモックを取得
      const mocks = context.parameters.apolloMocks || [];
      return (
        <MockedProvider mocks={mocks} addTypename={false}>
          <ToastProvider>
            <Story />
          </ToastProvider>
        </MockedProvider>
      );
    },
  ],
};

export default preview;
