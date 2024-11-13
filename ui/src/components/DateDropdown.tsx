import React, { useState } from "react";
import { Dropdown } from "monday-ui-react-core";

interface Props {
  defaultValue: string;
  allOptions: string[];
}
const DateDropdown = ({ defaultValue, allOptions }: Props) => {
  const [date, setDate] = useState(defaultValue);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <Dropdown
      defaultValue={date}
      options={allOptions}
      placeholder={defaultValue}
      searchable={true}
      onOptionSelect={handleDateChange}
    />
  );
};
export default DateDropdown;
