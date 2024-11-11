import { ReactElement, JSXElementConstructor } from "react";

export const TableEmptyState = (): ReactElement<
  any,
  string | JSXElementConstructor<any>
> => {
  return <p>No Data</p>;
};

export const TableErrorState = (): ReactElement<
  any,
  string | JSXElementConstructor<any>
> => {
  return <p>Error</p>;
};
