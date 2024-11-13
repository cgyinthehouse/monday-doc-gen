import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getContractorLatestOperationDate } from "../graphql/query";
import { TableRow, TableCell } from "monday-ui-react-core";
import DateDropdown from "./DateDropdown";
import Doc from "./Doc";

interface contractorsData {
  [name: string]: {
    [date: string]: {
      count: number;
    };
  };
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

        const dates: string[] = Object.keys(contractorsData[contractor]);
        const latestDate: string = dates.sort((a, b) => {
          return b.localeCompare(a);
        })[0];

        const count: number = contractorsData[contractor][latestDate].count;

        console.log(contractor, latestDate, count);

        return (
          <TableRow key={contractors.indexOf(contractor)}>
            <TableCell>{contractor}</TableCell>
            <TableCell>
              <DateDropdown defaultValue={latestDate} allOptions={dates} />
            </TableCell>
            <TableCell>{count}</TableCell>
            <TableCell>
              {<Doc docname={contractor} date={latestDate} count={count} />}
            </TableCell>
          </TableRow>
        );
      })}
      {children}
    </>
  );
};

export default memo(DataTableRows);
