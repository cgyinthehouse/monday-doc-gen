import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  getTodayContractorsV2,
  getTomorrowContractorsV2
} from "@/graphql/query";
import {
  getContractorDateAndCountQueryResult,
  contractorsCount,
  workerTypes
} from "@/types";

export const useContractorsLazyQuery = (time: "today" | "tomorrow") => {
  let query =
    time === "today" ? getTodayContractorsV2 : getTomorrowContractorsV2;
  const [data, setData] = useState<contractorsCount>({});

  const [getContractors, { data: d, loading, error, networkStatus }] =
    useLazyQuery(query, {
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
      data[item.column_values[0].text] = {
        count: parseInt(item.column_values[2].text),
        workerType: item.column_values[1].text as workerTypes,
        foreignWorkerCount: parseInt(item.column_values[3].text || "0")
      };
    });

    setData(data);
  }, [d]);

  return { getContractors, data, loading, error, networkStatus };
};

export const useContractorsQuery = (time: "today" | "tomorrow" = "today") => {
  let query =
    time === "today" ? getTodayContractorsV2 : getTomorrowContractorsV2;
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
      data[item.column_values[0].text] = {
        count: parseInt(item.column_values[2].text),
        workerType: item.column_values[1].text as workerTypes,
        foreignWorkerCount: parseInt(item.column_values[3].text || "0")
      };
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