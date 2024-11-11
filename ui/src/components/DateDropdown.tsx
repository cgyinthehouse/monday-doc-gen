import React, { useState } from "react";
import { Dropdown } from "monday-ui-react-core";

interface Props {
  options: string[];
}
const DateDropdown = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const onInputChange = (value: string) => {
    setSearchValue(value);
  };

  return <Dropdown options={props.options} onInputChange={onInputChange} />;
};
export default DateDropdown;
