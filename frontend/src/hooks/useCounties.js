import { useQuery } from "@tanstack/react-query";

export const useCounties = () => {
  return useQuery({
    queryKey: ["counties"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/counties/`);
      if (!response.ok) throw new Error("Failed to fetch counties");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    suspense: true, // Enable Suspense
  });
};
