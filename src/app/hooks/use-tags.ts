/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-tags.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"

export function useTags() {
  return useQuery<string[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      try {
        console.log("Fetching tags from API...")
        const response = await apiClient.get<any>("/products/tags")
        
        console.log("Raw tags response:", response)
        
        // Handle different response structures
        if (Array.isArray(response)) {
          console.log("Tags is array:", response)
          return response
        }
        
        if (response && response.data && Array.isArray(response.data)) {
          console.log("Tags in response.data:", response.data)
          return response.data
        }
        
        return []
      } catch (error) {
        console.error('Error fetching tags:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}