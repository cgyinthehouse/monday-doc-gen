import React, { useEffect, useState } from "react";

interface Props {
  contractor: string;
  date: string;
  count: number;
}
const Doc = ({ contractor, date, count }: Props) => {
  const [fileURL, setFileURL] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.DEV
          ? "http://localhost:8011/generate-doc"
          : "https://monday-docgen.ngrok.io",
        {
          method: "POST",
          body: JSON.stringify({ name: contractor, date: date, count: count }),
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
          }
        }
      );

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
      download={`${contractor}_${date}.docx`}
    >
      {contractor}
    </a>
  );
};

export default Doc;
