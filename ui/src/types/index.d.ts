export interface contractorsDateCountData {
  [name: string]: {
    [date: string]: {
      count: number;
    };
  };
}

export interface contractorsCount {
  [name: string]: {
    count: number;
    workerType: workerTypes;
    foreignWorkerCount: number;
  };
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
export type workerTypes =
  | "粗工"
  | "鋼構工"
  | "清潔工"
  | "泵送工"
  | "石材工"
  | "防水工"
  | "鋼筋工"
  | "電銲工"
  | "門窗工"
  | "測量工"
  | "外籍工作者"
  | "油漆工"
  | "模板工"
  | "裝修工"
  | "機械工"
  | "泥做工"
  | "電梯工"
  | "鷹架工"
  | "西工"
  | "水電工";
