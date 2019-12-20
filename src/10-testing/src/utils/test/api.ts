import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:23456/graphql';

export interface UserData {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export const user = async (variables: any): Promise<AxiosResponse<{ user: UserData }>> =>
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
