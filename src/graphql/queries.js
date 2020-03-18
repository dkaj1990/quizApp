/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      clientId
      name
      description
      expDate
      remDate
    }
  }
`;
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        name
        description
        expDate
        remDate
      }
      nextToken
    }
  }
`;
