import React, { useState, useEffect } from "react";

interface Props {
  docname: string;
  date: string;
  count: number;
}
const Doc = ({ docname, date, count }: Props) => {
  const [fileURL, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/generate-doc/${docname}`, {
          method: "POST",
          body: JSON.stringify({ name: docname, date: date, count: count })
        });

        setFileURL(URL.createObjectURL(await response.blob()));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [docname]);

  if (loading) return <div>loading...</div>;

  return (
    <a href={fileURL} target="_blank" download={`${docname}.docx`}>
      {docname}
    </a>
  );
};

export default Doc;
