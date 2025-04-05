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

    test('Logging out one session doesn\'t affect other sessions', () => {
      adminAuthRegister('user2@example.com', 'password123', 'Jane', 'Doe');

      const loginResult1 = adminAuthLogin('user@example.com', 'password123') as {session: string};
      const loginResult2 = adminAuthLogin('user2@example.com', 'password123') as {session: string};

      const firstSession = loginResult1.session;
      const secondSession = loginResult2.session;

      // Logout first session
      adminAuthLogout(firstSession);

      // Second session should still be valid
      expect(adminUserDetails(secondSession)).not.toStrictEqual(401);
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
