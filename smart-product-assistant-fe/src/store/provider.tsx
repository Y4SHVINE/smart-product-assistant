'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import Layout from '@/components/layout/Layout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
} 