import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Document from "./components/Doc";
import "monday-ui-react-core/dist/main.css";
import { useQuery } from "@apollo/client";
import { contractorsQuery } from "./graphql/query";
// import contractorsQuery from "./graphql/contractors.gql";

//Explore more Monday React Components here: https://style.monday.com/
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody
} from "monday-ui-react-core";
import { Doc, Calendar, Person, Team } from "monday-ui-react-core/icons";
import { TableEmptyState, TableErrorState } from "./components/TableStates";
import DataTableRows from "./components/DataTableRows";

type resData = Parameters<Parameters<typeof monday.listen>[1]>[number]["data"];

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState<resData>();
  const [contractors, setContractors] = useState<string[]>([""]);
  const { loading, error, data } = useQuery(contractorsQuery);

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen(["context", "events"], (res) => {
      setContext(res.data);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setContractors([
        ...new Set(
          data.boards[0].items_page.items.map(
            (item: { name: string }) => item.name
          )
        )
      ] as string[]);
    }
  }, [data]);

  const attentionBoxText = `Hello, your user_id is: ${
    context && "user" in context ? context.user.id : "still loading"
  }.`;
  console.log(attentionBoxText);
  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <h2>No Data</h2>;

  return (
    <div className="App">
      <Table
        columns={[
          { id: "contractor", title: "contractor", width: 100 },
          { id: "date", title: "date", width: 100 },
          { id: "workers count", title: "workers count", width: 100 },
          { id: "document", title: "document", width: 100 }
        ]}
        emptyState={<TableEmptyState />}
        errorState={<TableErrorState />}
      >
        <TableHeader>
          <TableHeaderCell title="廠商" icon={Person} />
          <TableHeaderCell title="日期" icon={Calendar} />
          <TableHeaderCell title="出工人數" icon={Team} />
          <TableHeaderCell title="報表" icon={Doc} />
        </TableHeader>
        <TableBody>
          <DataTableRows contractors={contractors} />
        </TableBody>
      </Table>
    </div>
  );
};

export default App;
