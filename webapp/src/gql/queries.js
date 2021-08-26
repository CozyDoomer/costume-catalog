import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
  mutation Authenticate($password: String!) {
    Authenticate(password: $password)
  }
`;

export const GET_COSTUMES = gql`
  query Costumes($search: String!) {
    costumes(search: $search) {
      id
      name
      description
      picture
      location
      tags {
        name
        icon
        importance
      }
    }
  }
`;

export const CREATE_COSTUME = gql`
  mutation CreateCostume(
    $name: String!
    $description: String
    $picture: String!
    $location: String!
    $tags: [TagInput]
  ) {
    CreateCostume(
      data: {
        name: $name
        description: $description
        picture: $picture
        location: $location
        tags: $tags
      }
    ) {
      id
      name
      description
      picture
      location
      tags {
        id
        name
        icon
        importance
      }
    }
  }
`;

export const DELETE_COSTUME = gql`
  mutation DeleteCostume($id: ID!) {
    DeleteCostume(id: $id)
  }
`;

export const UPDATE_COSTUME = gql`
  mutation UpdateCostume(
    $id: ID!
    $name: String!
    $description: String
    $picture: String!
    $location: String!
    $tags: [TagInput]
  ) {
    UpdateCostume(
      id: $id
      data: {
        name: $name
        description: $description
        picture: $picture
        location: $location
        tags: $tags
      }
    ) {
      id
      name
      description
      picture
      location
      tags {
        id
        name
        icon
        importance
      }
    }
  }
`;
