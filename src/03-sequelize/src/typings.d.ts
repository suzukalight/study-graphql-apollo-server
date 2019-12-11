type ID = string | number;

interface User {
  id: ID;
  firstName: string;
  lastName: string;
}

interface Users {
  [key: string]: User;
}

interface Message {
  id: ID;
  text: string;
  userId: ID;
}

interface Messages {
  [key: string]: Message;
}
