import type { Preview } from '@storybook/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import '../src/app/globals.css';

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
          <Story />
        </MockedProvider>
      );
    },
  ],
};

export default preview;
