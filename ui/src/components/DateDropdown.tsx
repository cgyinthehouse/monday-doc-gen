import React, { useMemo } from "react";
import { Dropdown } from "@vibe/core";

interface Props {
  defaultValue: string;
  allOptions: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const DateDropdown = ({ defaultValue, allOptions, setValue }: Props) => {
  const options = useMemo(() => {
    return allOptions.map((option) => ({
      label: option,
      value: option
    }));
  }, [allOptions]);
  return (
    <Dropdown
      defaultValue={[defaultValue]}
      options={options}
      placeholder={defaultValue}
      searchable={true}
      onOptionSelect={(option: any) => setValue(option.value)}
    />
  );
};
export default DateDropdown;
