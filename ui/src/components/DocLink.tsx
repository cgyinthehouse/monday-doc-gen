import React, { useState, useRef, useEffect } from "react";
import getDocumentURL from "@/utils/getDocumentURL";

interface Props {
  contractor: string;
  date: string;
  count: number;
}

const Doc = ({ contractor, date, count }: Props) => {
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

  const handleClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // 需要fetch new url 的情況
    // 1. mountedRef.current.href 沒有值時
    // 2. props 改變之後

    if (mountedRef.current?.href || !urlNeedUpdate) {
      return;
    }

    event.preventDefault();
    try {
      setLoading(true);
      url.current = await getDocumentURL(contractor, date, count);
      setLoading(false);
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
