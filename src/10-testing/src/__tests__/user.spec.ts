import { user, UserData } from '../utils/test/api';

describe('users', () => {
  it('user is user', () => {
    expect('user').toBe('user');
  });

  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult: { data: { user: UserData } } = {
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
});
