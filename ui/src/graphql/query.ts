import { gql } from "@apollo/client";

export const contractorsQuery = gql`
  query getConctractors {
    boards(ids: 7652880320) {
      name
      items_page(limit: 100) {
        items {
          name
        }
      }
    }
  }
`;

// TODO: figure out how to 每個廠商只抓最新出工日期
export const getContractorLatestDate = gql`
  query getContractorLatestOperationDate($contractors: CompareValue!) {
    boards(ids: 7652880320) {
      items_page(
        limit: 100
        query_params: {
          rules: { column_id: "name", compare_value: $contractors }
          order_by: [
            { column_id: "name" }
            { column_id: "date__1", direction: desc }
          ]
          operator: and
        }
      ) {
        items {
          name
          column_values(types: [date, numbers]) {
            text
          }
        }
      }
    }
  }
`;

export const getTodayContractors = gql`
  query getTodayContractors {
    boards(ids: 7652880320) {
      items_page(
        query_params: {
          rules: { column_id: "date__1", compare_value: "TODAY" }
        }
      ) {
        items {
          name
          column_values(types: [numbers]) {
            text
          }
        }
      }
    }
  }
`;

// 填表人、承包商、工種、出工人數、外籍工作者人數
export const getTodayContractorsV2 = gql`
  query getTodayContractors_v2 {
    boards(ids: 7970779689) {
      items_page(
        query_params: {
          rules: { column_id: "date9__1", compare_value: "TODAY" }
        }
      ) {
        items {
          name
          column_values(
            ids: [ "name", "color__1", "color08__1", "numeric__1", "numeric1__1"]
          ) {
            text
          }
        }
      }
    }
  }
`;

export const getTomorrowContractors = gql`
  query getTomorrowContractors {
    boards(ids: 7652880320) {
      items_page(
        query_params: {
          rules: { column_id: "date__1", compare_value: "TOMORROW" }
        }
      ) {
        items {
          name
          column_values(types: [numbers]) {
            text
          }
        }
      }
    }
  }
`;

// 填表人、承包商、工種、出工人數、外籍工作者人數
export const getTomorrowContractorsV2 = gql`
  query getTomorrowContractors_v2 {
    boards(ids: 7970779689) {
      items_page(
        query_params: {
          rules: { column_id: "date9__1", compare_value: "TOMORROW" }
        }
      ) {
        items {
          name
          column_values(
            ids: [ "name", "color__1", "color08__1", "numeric__1", "numeric1__1"]
          ) {
            text
          }
        }
      }
    }
  }
`;
