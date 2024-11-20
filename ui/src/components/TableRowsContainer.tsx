import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getContractorLatestOperationDate } from "../graphql/query";
import TableRow from "./TableRow";
import { contractorsData } from "../types";

interface DataQueryResult {
  boards: [
    {
      items_page: {
        items: [
          {
            name: string;
            column_values: { text: string }[];
          }
        ];
      };
    }
  ];
}

interface props {
  contractors: string[];
  children?: React.ReactNode;
}

const TableRowsContainer = ({ contractors, children }: props) => {
  const { loading, error, data } = useQuery(getContractorLatestOperationDate, {
    variables: { contractors }
  });
  const [contractorsData, setContractorsData] =
    useState<contractorsData | null>(null);

  const d1 = data as DataQueryResult;

  useEffect(() => {
    const contractorsData: contractorsData = {};
    if (!d1) return;
    contractors.forEach((contractor) => {
      d1.boards[0].items_page.items.forEach((item) => {
        if (item.name === contractor) {
          if (!(contractor in contractorsData)) {
            contractorsData[contractor] = {};
          }
          if (!(item.column_values[0].text in contractorsData[contractor])) {
            contractorsData[contractor][item.column_values[0].text] = {
              count: parseInt(item.column_values[1].text)
            };
          }
        }
      });
    });

    console.log(contractorsData);
    setContractorsData(contractorsData);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {contractors.map((contractor) => {
        if (!contractorsData || !(contractor in contractorsData)) return;

        return (
          <TableRow key={contractor} contractor={contractor} contractorsData={contractorsData} />
        );
      })}
      {children}
    </>
  );
};

export default memo(TableRowsContainer);
