import React, { useState, useMemo, useEffect } from "react";
import Doc from "./Doc";
import DateDropdown from "./DateDropdown";
import { TableRow as MTableRow, TableCell } from "monday-ui-react-core";
import { contractorsData } from "../types";

interface props {
  contractor: string;
  contractorsData: contractorsData;
}

const TableRow = ({ contractorsData, contractor }: props) => {
  const {
    dates,
    latestDate,
    count: c
  } = useMemo(() => {
    const dates: string[] = Object.keys(contractorsData[contractor]);
    const latestDate: string = dates.sort((a, b) => {
      return b.localeCompare(a);
    })[0];

    const count: number = contractorsData[contractor][latestDate].count;
    return { dates, latestDate, count };
  }, [contractorsData, contractor]);
  const [date, setDate] = useState(latestDate);
  const [count, setCount] = useState(c);

  useEffect(() => {
    setCount(contractorsData[contractor][date].count);
  }, [date]);

  return (
    <MTableRow>
      <TableCell>{contractor}</TableCell>
      <DateDropdown defaultValue={date} allOptions={dates} setValue={setDate} />
      <TableCell>{count}</TableCell>
      <TableCell>
        <Doc contractor={contractor} date={date} count={count} />
      </TableCell>
    </MTableRow>
  );
};

export default TableRow;
