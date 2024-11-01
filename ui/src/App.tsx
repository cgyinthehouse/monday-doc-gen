import React, { JSXElementConstructor } from "react";
import { useState, useEffect, ReactElement } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import generateDoc from '@docgen/index'
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import { AttentionBox, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from "monday-ui-react-core";
import { Doc, Calendar, Team } from "monday-ui-react-core/icons";

type resData = Parameters<Parameters<typeof monday.listen>[1]>[number]["data"];
// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const TableEmptyState = (): ReactElement<any, string | JSXElementConstructor<any>> => {
  return <p>No Data</p>
}

const TableErrorState = (): ReactElement<any, string | JSXElementConstructor<any>> => {
  return <p>Error</p>
}


const items = [
  { contractor: "a", date: "2020-01-01", document: generateDoc() },
  { contractor: "b", date: "2020-01-01", document: generateDoc() },
  { contractor: "c", date: "2020-01-01", document: generateDoc() },
]
const App = () => {
  const [context, setContext] = useState<resData>();

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
  // const attentionBoxText = `Hello, your user_id is: ${context && "user" in context ? context.user.id : "still loading"
  //   }.
  // Let's start building your amazing app, which will change the world!`;

  return (
    <div className="App">
      <Table
        columns={
          [
            { id: 'contractor', title: "contractor", width: 150 },
            { id: 'date', title: "date", width: 150 },
            { id: 'document', title: "document", width: 150 },
          ]
        }
        emptyState={<TableEmptyState />}
        errorState={<TableErrorState />}
      >
        <TableHeader>
          <TableHeaderCell title="廠商" icon={Team} />
          <TableHeaderCell title="日期" icon={Calendar} />
          <TableHeaderCell title="報表" icon={Doc} />
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={items.indexOf(item)}>
              <TableCell>{item.contractor}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.document}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <AttentionBox
        title="Hello Monday Apps!"
        text={attentionBoxText}
      /> */}
    </div>
  );
};

export default App;
