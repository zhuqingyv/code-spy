import { defineConfig } from 'vite';
import path from 'path';

export default () => {
  return defineConfig({
    resolve: {
      alias: {
        'utils': path.resolve(__dirname, '../common/utils/index.ts'),
        'types': path.resolve(__dirname, './src/types/index.ts')
      }
    }
  });
};