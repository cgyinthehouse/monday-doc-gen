import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens"
import DownloadSection from "./components/DownloadSection";

type resData = Parameters<Parameters<typeof monday.listen>[1]>[number]["data"];

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState<resData>();
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (import.meta.env.PRO) {
      document.title = import.meta.env.VITE_APP_TITLE;
    }
  }, []);

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen(["context", "events"], (res) => {
      setContext(res.data);
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data

  useEffect(() => {
    if (context && "user" in context) {
      setText(`Hello, your user_id is: ${context.user.id}`);
    }
  }, [context]);

  return (
    <div className="App">
      <p>{text}</p>
      <DownloadSection />
    </div>
  );
};

export default App;
