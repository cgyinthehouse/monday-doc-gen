import React, { useEffect, useReducer, useState } from "react";
import { useQuery } from "@apollo/client";
import { getContractorLatestOperationDate } from "../graphql/query";
import { TableRow, TableCell } from "monday-ui-react-core";
import DateDropdown from "./DateDropdown";
import Doc from "./Doc";

interface contractorsData {
  [key: string]: {
    date: string;
    count: number;
  }[];
}
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

const DataTableRows = ({ contractors, children }: props) => {
  const [latestDataOfContractor, setLatestDataofContractor] =
    useState<DataQueryResult>();

  const { loading, error, data } = useQuery(getContractorLatestOperationDate, {
    variables: { contractors }
  });
  const d1 = data as DataQueryResult;

  const contractorsData: contractorsData = {};
  useEffect(() => {
    if (d1) {
      setLatestDataofContractor(d1);

      contractors.forEach((contractor) => {
        d1.boards[0].items_page.items.forEach((item) => {
          if (item.name === contractor) {
            if (!contractorsData[contractor]) contractorsData[contractor] = [];
            contractorsData[contractor].push({
              date: item.column_values[0].text,
              count: parseInt(item.column_values[1].text)
            });
          }
        });
      });

      console.log(contractorsData);
    }
  }, [d1]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!latestDataOfContractor) return <h3 style={{ color: "red" }}>No Data</h3>;

  return (
    <>
      {contractors.map((contractor) => (
        <TableRow key={contractors.indexOf(contractor)}>
          <TableCell>{contractor}</TableCell>
          <TableCell>
            <DateDropdown
              options={contractorsData[contractor].map((item) => item.date)}
            />
          </TableCell>
          <TableCell>{contractorsData[contractor][0].count}</TableCell>
          <TableCell>
            {
              <Doc
                docname={contractor}
                date={contractorsData[contractor][0].date}
                count={contractorsData[contractor][0].count}
              />
            }
          </TableCell>
        </TableRow>
      ))}
      {children}
    </>
  );
};

export default DataTableRows;
