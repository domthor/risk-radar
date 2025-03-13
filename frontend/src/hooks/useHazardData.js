import { useQuery } from "@tanstack/react-query";

const fetchHazards = async (selectedCounty) => {
    console.log(selectedCounty);
  if (!selectedCounty) throw new Error("No county selected");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/disaster_summaries/?fipsStateCode=${
      selectedCounty.fipsStateCode
    }&fipsCountyCode=${selectedCounty.fipsCountyCode}`
  );
  const data = await response.json();

  const summaries = data.DisasterDeclarationsSummaries || [];
  summaries.sort((a, b) => new Date(b.declarationDate) - new Date(a.declarationDate));

  const hazardCounts = summaries.reduce((acc, summary) => {
    const incidentType = summary.incidentType;
    if (incidentType) acc[incidentType] = (acc[incidentType] || 0) + 1;
    return acc;
  }, {});

  const oldestDate = summaries.length
    ? new Date(Math.min(...summaries.map(s => new Date(s.declarationDate)))).getFullYear()
    : null;

  return { summaries, hazardCounts, oldestDate };
};

export function useHazardData(selectedCounty) {
  return useQuery({
    queryKey: ["hazardData", selectedCounty],
    queryFn: () => fetchHazards(selectedCounty),
    suspense: true, // Enables Suspense mode
  });
}
