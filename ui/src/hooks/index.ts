import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getTodayContractors, getTomorrowContractors } from "@/graphql/query";
import File from "@/utils/File";
import {
  getContractorDateAndCountQueryResult,
  contractorsCount
} from "@/types";

export const useContractorsQuery = (time: "today" | "tomorrow" = "today") => {
  let query = time === "today" ? getTodayContractors : getTomorrowContractors;
  const [data, setData] = useState<contractorsCount>({});
  const {
    data: d,
    loading,
    error,
    refetch,
    networkStatus
  } = useQuery(query, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first" // Used for subsequent executions
  });

  useEffect(() => {
    if (d === undefined) return;
    const data: contractorsCount = {};
    (
      d as getContractorDateAndCountQueryResult
    ).boards[0].items_page.items.forEach((item) => {
      data[item.name] = parseInt(item.column_values[0].text);
    });

    setData(data);
  }, [d]);

  return {
    data,
    loading,
    error,
    refetch,
    networkStatus
  };
};

export const useGetDocURL = (name: string, date: string, count: number) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const url = new File(name, date, count).getFileURL();
      setUrl(url);
      setLoading(false);
    })();
  }, [name, date, count]);

  return { url, loading };
};
