import {
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminUserDetails,
  clear
} from '../requests';

describe('POST /v1/admin/auth/logout', () => {
  let sessionToken: string;
  let registerResult: number | { session: string };

  beforeEach(() => {
    clear();

    registerResult = adminAuthRegister('user@example.com', 'password123', 'John', 'Doe');
  });

  describe('Success cases', () => {
    beforeEach(() => {
      expect(registerResult).toHaveProperty('session');
      sessionToken = (registerResult as { session: string }).session;
    });

    test('Successfully logs out a user with a valid session', () => {
      const res = adminAuthLogout(sessionToken);
      expect(res).toStrictEqual({});

      expect(adminUserDetails(sessionToken)).toStrictEqual(401);
    });
  });

  describe('Error cases', () => {
    test('Error when session is empty', () => {
      const res = adminAuthLogout('');
      expect(res).toStrictEqual(401);
    });

    test('Error when session is invalid', () => {
      const res = adminAuthLogout('invalid-session-token');
      expect(res).toStrictEqual(401);
    });

    test('Error when session is expired or no longer active', () => {
      adminAuthLogin('user@example.com', 'password123');
      adminAuthLogout(sessionToken);

      // Try to log out again with same session (should be invalid)
      const res = adminAuthLogout(sessionToken);
      expect(res).toStrictEqual(401);
    });
  });
});
