export const users: Users = {
  '1': { id: '1', firstName: 'masahiko', lastName: 'kubara' },
  '2': { id: '2', firstName: 'suzuka', lastName: 'light' },
};

export const messages: Messages = {
  '1': { id: '1', text: 'Hello, world!', userId: '1' },
  '2': { id: '2', text: 'from GraphQL and Apollo-Server.', userId: '2' },
  '3': { id: '3', text: 'textextext', userId: '2' },
};

export default {
  users,
  messages,
};
