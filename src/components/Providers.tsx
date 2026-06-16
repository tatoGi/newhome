'use client';

import React from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { BootstrapProvider } from '@/context/BootstrapContext';
import { PwaProvider } from '@/context/PwaContext';
import { BootstrapResponse } from '@/lib/api/types';

export default function Providers({
  children,
  bootstrapData
}: {
  children: React.ReactNode;
  bootstrapData: BootstrapResponse;
}) {
  return (
    <BootstrapProvider data={bootstrapData}>
      <AuthProvider>
        <AppProvider>
          <PwaProvider>
            {children}
            <ProgressBar
              height="3px"
              color="var(--accent-color)"
              options={{ showSpinner: false }}
              shallowRouting
            />
          </PwaProvider>
        </AppProvider>
      </AuthProvider>
    </BootstrapProvider>
  );
}
