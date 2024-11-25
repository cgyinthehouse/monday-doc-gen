const getDocumentURL: (
  name: string,
  date: string,
  count: number
) => Promise<string> = async (name, date, count) => {
  const host = import.meta.env.DEV
    ? "http://localhost:8011"
    : "https://monday-docgen.ngrok.io";
  try {
    const response = await fetch(`${host}/generate-doc`, {
      method: "POST",
      body: JSON.stringify({ name, date, count }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*"
      }
    });

    return URL.createObjectURL(await response.blob());
  } catch (e) {
    console.error(e);
    throw e;
  }
};
export default getDocumentURL;
