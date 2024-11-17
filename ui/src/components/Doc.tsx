import React, { useEffect, useState, useRef } from "react";

interface Props {
  contractor: string;
  date: string;
  count: number;
}

const Doc = ({ contractor, date, count }: Props) => {
  const host = import.meta.env.DEV
    ? "http://localhost:8011"
    : "https://monday-docgen.ngrok.io";
  const [fileURL, setFileURL] = useState<string>("#");
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (fileURL !== "#" && mountedRef.current) {
      mountedRef.current.download = `${contractor}_${date}.docx`;
      mountedRef.current.click();
    }
  }, [fileURL, contractor, date]);

  const getDocumentURL = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/generate-doc`, {
        method: "POST",
        body: JSON.stringify({ name: contractor, date: date, count: count }),
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      });

      setFileURL(URL.createObjectURL(await response.blob()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <a
      ref={mountedRef}
      onClick={() => fileURL === "#" && getDocumentURL()}
      href={fileURL}
      target="_self"
      type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    >
      {loading || contractor}
    </a>
  );
};

export default Doc;
