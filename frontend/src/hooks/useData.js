import { useQuery } from "@tanstack/react-query";

const fetchHazards = async (route) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${route}`).then((res) => res.json());
  return res;
};

export function useData(route) {
  return useQuery({
    queryKey: [route],
    queryFn: () => fetchHazards(route),
    suspense: true,
  });
}

export default useData;
