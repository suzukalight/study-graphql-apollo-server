import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = `http://localhost:${process.env.DB_PORT}/graphql`;

export interface UserData {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export interface UserResponse {
  data: { user: UserData };
}

export interface GetUserInput {
  id: string;
}

const GET_USER = `
  query ($id: ID!) {
    user(id: $id) {
      id
      username
      email
      role
    }
  }
`;

export interface SignUpData {
  token: string;
}

export interface SignUpResponse {
  data: { signIn: SignInData };
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SIGN_UP = `
  mutation ($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    signUp(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      token
    }
  }
`;

export interface SignInData {
  token: string;
}

export interface SignInResponse {
  data: { signIn: SignInData };
}

export interface SignInInput {
  email: string;
  password: string;
}

const SIGN_IN = `
  mutation ($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

export interface DeleteUserInput {
  id: string;
}

const DELETE_USER = `
  mutation ($id: ID!) {
    deleteUser (id: $id) 
  }
`;

export interface DeleteUserResponse {
  data: {
    deleteUser: boolean;
  };
  errors: Record<string, any>;
}

export const user = async (variables: GetUserInput) =>
  axios.post<UserResponse>(API_URL, { query: GET_USER, variables });

export const signUp = async (variables: SignUpInput) =>
  axios.post<SignUpResponse>(API_URL, { query: SIGN_UP, variables });

export const signIn = async (variables: SignInInput) =>
  axios.post<SignInResponse>(API_URL, { query: SIGN_IN, variables });

export const deleteUser = async (variables: DeleteUserInput, token: string) =>
  axios.post<DeleteUserResponse>(
    API_URL,
    {
      query: DELETE_USER,
      variables,
    },
    { headers: { 'x-token': token } },
  );
