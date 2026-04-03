'use client';

import React, { createContext, useContext, useState } from 'react';
import { BootstrapResponse } from '@/lib/api/types';
import { api } from '@/lib/api/client';

interface BootstrapContextType {
    data: BootstrapResponse;
    isLoading: boolean;
    refreshBootstrap: (locale?: string) => Promise<void>;
}

const BootstrapContext = createContext<BootstrapContextType | undefined>(undefined);

export const BootstrapProvider: React.FC<{
    children: React.ReactNode;
    data: BootstrapResponse;
}> = ({ children, data }) => {
    const [bootstrapData, setBootstrapData] = useState<BootstrapResponse>(data);
    const [isLoading, setIsLoading] = useState(false);

    const refreshBootstrap = async (locale?: string): Promise<void> => {
        setIsLoading(true);

        if (locale) {
            document.cookie = `newhome_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        }

        try {
            const nextData = await api.getBootstrap(locale);
            React.startTransition(() => {
                setBootstrapData(nextData);
            });
        } catch (error) {
            console.error('Failed to refresh bootstrap data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BootstrapContext.Provider value={{ data: bootstrapData, isLoading, refreshBootstrap }}>
            {children}
        </BootstrapContext.Provider>
    );
};

export const useBootstrap = () => {
    const context = useContext(BootstrapContext);
    if (!context) {
        throw new Error('useBootstrap must be used within a BootstrapProvider');
    }

    return {
        ...context.data,
        isLoading: context.isLoading,
        refreshBootstrap: context.refreshBootstrap,
    };
};
