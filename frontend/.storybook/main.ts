import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
    '../src/app/**/*.stories.@(ts|tsx)',
    '../src/stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }
    return config;
  },
};

export default config;
