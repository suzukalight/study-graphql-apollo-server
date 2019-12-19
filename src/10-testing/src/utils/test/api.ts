import axios from 'axios';

const API_URL = 'http://localhost:23456/graphql';

export const user = async (variables: any) =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables,
  });
