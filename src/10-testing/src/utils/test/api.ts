import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:23456/graphql';

export interface UserData {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export interface GetUserInput {
  id: string;
}

const GET_USER = `
  query($id: ID!) {
    user(id: $id) {
      id
      username
      email
      role
    }
  }
`;

export const user = async (variables: GetUserInput): Promise<AxiosResponse<{ user: UserData }>> =>
  axios.post(API_URL, { query: GET_USER, variables });
