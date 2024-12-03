import React, { useState } from "react";
import {
  SplitButton,
  SplitButtonMenu,
  MenuItem,
  Toast,
  Tooltip
} from "monday-ui-react-core";
import { Download } from "monday-ui-react-core/icons";

import { useContractorsQuery } from "@/hooks";
import { NetworkStatus } from "@apollo/client";
import File from "@/utils/File";
import getDate from "@/utils/getDate";

interface props {
  children?: React.ReactNode;
}
const DownloadButton = ({ children }: props) => {
  const [day, setDay] = useState<"today" | "tomorrow">("today");

  const { data, loading, error, refetch, networkStatus } =
    useContractorsQuery(day);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleClick = async () => {
    if (Object.keys(data).length === 0) {
      console.warn("no data");
      await refetch();
      return;
    }

    console.log(data);

    const date = getDate(day, true);
    for (const [name, count] of Object.entries(data)) {
      const t = await new File(name, date, count).generate()
      const url = t.getFileURL()
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}_${date}.docx`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Tooltip content={`已選擇：${day === "today" ? "今日" : "明日"}`}>
        <SplitButton
          leftIcon={Download}
          size="large"
          loading={loading || networkStatus === NetworkStatus.loading}
          children={children}
          onClick={handleClick}
          secondaryDialogPosition={
            SplitButton.secondaryDialogPositions.BOTTOM_END
          }
          secondaryDialogContent={
            <SplitButtonMenu>
              <MenuItem
                isInitialSelectedState={day === "today"}
                selected={day === "today"}
                onClick={() => setDay("today")}
                title="今日危害告知單"
              />
              <MenuItem
                isInitialSelectedState={day === "tomorrow"}
                selected={day === "tomorrow"}
                onClick={() => setDay("tomorrow")}
                title="明日危害告知單"
              />
            </SplitButtonMenu>
          }
        />
      </Tooltip>
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

export default DownloadButton;
