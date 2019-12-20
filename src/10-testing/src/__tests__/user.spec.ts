import * as userApi from '../utils/test/api';

describe('users', () => {
  it('user is user', () => {
    expect('user').toBe('user');
  });

  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult: { data: { user: userApi.UserData } } = {
        data: {
          user: {
            id: 1,
            username: 'masahiko kubara',
            email: 'masahiko_kubara@email.com',
            role: 'member',
          },
        },
      };
      const result = await userApi.user({ id: '1' });
      expect(result.data).toMatchObject(expectedResult);
    });

    it('returns null', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await userApi.user({ id: '99999' });
      expect(result.data).toMatchObject(expectedResult);
    });
  });
});
