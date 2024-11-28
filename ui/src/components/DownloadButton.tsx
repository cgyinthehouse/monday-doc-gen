import React, { useState } from "react";
import {
  SplitButton,
  SplitButtonMenu,
  MenuItem,
  Toast
} from "monday-ui-react-core";
import { useContractorsQuery } from "@/hooks";
import { Download, Check } from "monday-ui-react-core/icons";
import { NetworkStatus } from "@apollo/client";
import getDocumentURL from "@/utils/getDocumentURL";

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

    function getDate(day: "today" | "tomorrow") {
      const today = new Date();
      if (day === "tomorrow") today.setDate(today.getDate() + 1);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const Day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${Day}`;
    }

    const date = getDate(day);
    for (const [name, count] of Object.entries(data)) {
      const url = await getDocumentURL(name, date, count);
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
      <SplitButton
        leftIcon={Download}
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
              title="Today"
            />
            <MenuItem
              isInitialSelectedState={day === "tomorrow"}
              selected={day === "tomorrow"}
              onClick={() => setDay("tomorrow")}
              title="Tomorrow"
              label={day === "tomorrow" ? <Check /> : ""}
            />
          </SplitButtonMenu>
        }
      />
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
