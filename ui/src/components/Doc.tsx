import React, { useState, useRef, useEffect } from "react";

interface Props {
  contractor: string;
  date: string;
  count: number;
}

const Doc = ({ contractor, date, count }: Props) => {
  const host = import.meta.env.DEV
    ? "http://localhost:8011"
    : "https://monday-docgen.ngrok.io";
  const [loading, setLoading] = useState(false);
  const [urlNeedUpdate, setUrlNeedUpdate] = useState(false);
  const url = useRef<string | null>(null);
  const mountedRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setUrlNeedUpdate(true);
    if (mountedRef.current) {
      if (mountedRef.current.href) {
        mountedRef.current.removeAttribute("href");
      }
    }
  }, [date]);

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

      return URL.createObjectURL(await response.blob());
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // 需要fetch new url 的情況
    // 1. url.current 爲'#'時
    // 2. props 改變之後

    if (mountedRef.current?.href || !urlNeedUpdate) {
      return;
    }

    event.preventDefault();
    try {
      url.current = await getDocumentURL();
      if (mountedRef.current) {
        mountedRef.current.href = url.current;
      }
      mountedRef.current?.click();
      setUrlNeedUpdate(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <a
      style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
      ref={mountedRef}
      onClick={handleClick}
      download={`${contractor}_${date}.docx`}
      target="_self"
      type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    >
      {loading ? "Loading..." : contractor}
    </a>
  );
};

export default Doc;
