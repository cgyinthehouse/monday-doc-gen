import React from "react";
import { Button } from "@vibe/core";
import { useContractorsQuery } from "@/hooks";
import { NetworkStatus } from "@apollo/client";
import File from "@/utils/File";
import getDate from "@/utils/getDate";

type Props = { text: "今日" | "明日" };

const DownloadButton = ({ text }: Props) => {
  const day = text === "今日" ? "today" : "tomorrow";
  const { refetch, data, loading, error, networkStatus } =
    useContractorsQuery(day);

  const handleClick = async () => {
    await refetch();

    if (Object.keys(data).length === 0) {
      console.warn(`${day} no data`);
      return;
    }

    console.log(data);

    const date = getDate(day, true);
    for (const [name, count] of Object.entries(data)) {
      new File(name, date, count);
    }

    await File.downloadFiles(date);
    File.release();
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Button
      key={day}
      loading={loading || networkStatus === NetworkStatus.refetch}
      onClick={handleClick}
      style={{ fontSize: "1.2rem", width: "120px" }}
      disabled={
        !loading &&
        !(networkStatus === NetworkStatus.loading) &&
        Object.keys(data).length === 0
      }
    >
      {Object.keys(data).length > 0 ? text : `${text}無出工`}
    </Button>
  );
};

export default DownloadButton;
