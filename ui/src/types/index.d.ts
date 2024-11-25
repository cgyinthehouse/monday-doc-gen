export interface contractorsDateCountData {
  [name: string]: {
    [date: string]: {
      count: number;
    };
  };
}

export interface contractorsCount {
  [name: string]: number;
}

export interface getContractorDateAndCountQueryResult {
  boards: [
    {
      items_page: {
        items: [
          {
            name: string;
            column_values: { text: string }[];
          }
        ];
      };
    }
  ];
}
