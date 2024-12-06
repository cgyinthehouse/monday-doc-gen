import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuTitle,
  MenuDivider,
  MenuItemButton,
  Toast
} from "@vibe/core";
import { Download } from "@vibe/icons";

import { useContractorsQuery } from "@/hooks";
import { NetworkStatus } from "@apollo/client";
import File from "@/utils/File";
import getDate from "@/utils/getDate";

const { date: today_date } = getDate("today");
const { date: tomorrow_date } = getDate("tomorrow");
const { month } = getDate("today");

const DownloadMenu = () => {
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const { data, loading, error, networkStatus } = useContractorsQuery(day);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleClick = async () => {
    if (Object.keys(data).length === 0) {
      console.warn("no data");
      return;
    }

    console.log(data);

    const date = getDate(day, true);

    for (const [name, count] of Object.entries(data)) {
      new File(name, date, count);
    }

    File.downloadFiles(date);
  };

  return (
    <>
      <Menu size="large">
        <MenuItemButton
          disabled={loading || networkStatus === NetworkStatus.loading}
          leftIcon={Download}
          onClick={handleClick}
        >
          下載
        </MenuItemButton>
        <MenuTitle caption="日期" />
        <MenuDivider />
        <MenuItem
          selected={day === "today"}
          onClick={() => {
            setDay("today");
            File.release();
          }}
          title={`今日 (${month}/${today_date})`}
        />
        <MenuItem
          selected={day === "tomorrow"}
          onClick={() => {
            File.release();
            setDay("tomorrow");
          }}
          title={`明日 (${month}/${tomorrow_date})`}
        />
      </Menu>
      <Toast
        children={
          loading || networkStatus === NetworkStatus.loading
            ? "Loading..."
            : day === "today"
            ? "今日無出工"
            : `明日無出工`
        }
        open={
          !loading &&
          !(networkStatus === NetworkStatus.loading) &&
          Object.keys(data).length === 0
        }
        closeable={false}
      />
    </>
  );
};

export default DownloadMenu;
