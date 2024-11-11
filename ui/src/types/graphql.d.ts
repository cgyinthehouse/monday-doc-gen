declare module './graphql/*.gql' {
  import { DocumentNode } from 'graphql'
  const Query: DocumentNode

  export default Query
}