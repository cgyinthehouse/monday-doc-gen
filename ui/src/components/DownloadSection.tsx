import React, { useState } from "react";
import { Flex } from "@vibe/core";
import DownloadButton from "./DownloadButton";

const DownloadSection = () => {
  return (
    <Flex direction="column" gap="medium">
      <DownloadButton text="今日" />
      <DownloadButton text="明日" />
    </Flex>
  );
};

export default DownloadSection;
