import React, { useState, useEffect } from "react";

interface Props {
  docname: string;
  date: string;
  count: number;
}
const Doc = ({ docname, date, count }: Props) => {
  const [fileURL, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8011/generate-doc", {
        method: "POST",
        body: JSON.stringify({ name: docname, date: date, count: count }),
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      });

      console.log(docname, date, count);

      setFileURL(URL.createObjectURL(await response.blob()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <a
      onClick={fetchDocument}
      href={fileURL}
      target="_blank"
      type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      download
    >
      {docname}
    </a>
  );
};

export default Doc;
