/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/providers/query-provider.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode, useState } from "react"
import { toast } from "react-hot-toast"

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        gcTime: 5 * 60 * 1000, // 5 minutes
                        retry: (failureCount: number, error: any) => {
                            if (error?.response?.status === 404) return false
                            if (error?.response?.status === 401) return false
                            if (error?.response?.status === 403) return false
                            return failureCount < 2
                        },
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                        retryDelay: (attemptIndex : any) => Math.min(1000 * 2 ** attemptIndex, 30000),
                        onError: (error: any) => {
                            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                                toast.error(error?.response?.data?.message || "An error occurred")
                            }
                        },
                    } as any,
                    mutations: {
                        onError: (error: any) => {
                            toast.error(error?.response?.data?.message || "An error occurred")
                        },
                        onSuccess: (data: any) => {
                            if (data?.message) {
                                toast.success(data.message)
                            }
                        },
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}