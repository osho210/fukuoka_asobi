import type { Preview } from '@storybook/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from '../src/components/common/ToastContext';
import '../src/app/globals.css';
import '../public/styles/common.css';
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
import '../public/styles/AboutPage.css';
import '../public/styles/Auth.css';
import '../public/styles/BusinessHour.css';
import '../public/styles/ContentDetail.css';
import '../public/styles/EventsPage.css';
import '../public/styles/HamburgerMenu.css';
import '../public/styles/NewsPage.css';
import '../public/styles/PlayPlanDetail.css';
import '../public/styles/RecommendedEvent.css';
import '../public/styles/RecommendedSpot.css';
import '../public/styles/SpotsPage.css';



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
