'use client';

import React from 'react';
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
          <PwaProvider>{children}</PwaProvider>
        </AppProvider>
      </AuthProvider>
    </BootstrapProvider>
  );
}
