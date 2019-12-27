import { user, signIn, deleteUser, UserResponse, signUp } from '../utils/test/api';

describe('users', () => {
  it('user is user', () => {
    expect('user').toBe('user');
  });

  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult: UserResponse = {
        data: {
          user: {
            id: '1',
            username: 'masahiko kubara',
            email: 'masahiko_kubara@email.com',
            role: 'member',
          },
        },
      };
      const result = await user({ id: '1' });
      expect(result.data).toMatchObject(expectedResult);
    });

    it('returns null', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await user({ id: '99999' });
      expect(result.data).toMatchObject(expectedResult);
    });
  });

  describe('signIn and deleteUser', () => {
    it('returns error when user is not admin', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({ email: 'masahiko_kubara@email.com', password: 'masahikokubara' });

      const {
        data: { errors },
      } = await deleteUser({ id: '3' }, token);

      expect(errors[0].message).toBe('Not authorized as admin');
    });

    it('returns id', async () => {
      await signUp({
        firstName: 'new',
        lastName: 'user',
        email: 'newuser@email.com',
        password: 'newuser',
      });

      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({ email: 'suzukalight@email.com', password: 'suzukalight' });

      const {
        data: {
          data: { deleteUser: result },
        },
      } = await deleteUser({ id: '3' }, token);

      expect(result).toBeTruthy();
    });
  });
});
