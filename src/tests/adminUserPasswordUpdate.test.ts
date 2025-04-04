import {
  adminAuthRegister,
  adminAuthLogin,
  //  adminUserDetails,
  adminUserPasswordUpdate,
  clear
} from '../requests';

describe('tests for adminUserPasswordUpdate', () => {
  let sessionToken: string;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'user@example.com', 'password123', 'John', 'Doe'
    ) as { session: string };
    sessionToken = registerResult.session;
  });

  describe('Success Cases', () => {
    test('Successfully updates user password', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'password123', 'newPassword456');
      expect(res).toStrictEqual({});

      const loginResult = adminAuthLogin('user@example.com', 'newPassword456');
      expect(loginResult).toStrictEqual({
        session: expect.any(String)
      });
    });

    test('Multiple password updates work correctly', () => {
      adminUserPasswordUpdate(sessionToken, 'password123', 'newPassword456');

      let loginResult = adminAuthLogin(
        'user@example.com', 'newPassword456'
      ) as { session: string };
      const newSessionToken = loginResult.session;

      adminUserPasswordUpdate(newSessionToken, 'newPassword456', 'anotherPassword789');

      // new password works
      loginResult = adminAuthLogin(
        'user@example.com', 'anotherPassword789'
      ) as { session: string };
      expect(loginResult).toStrictEqual({
        session: expect.any(String)
      });

      // old passwords no longer work
      expect(adminAuthLogin('user@example.com', 'password123')).toStrictEqual(400);
      expect(adminAuthLogin('user@example.com', 'newPassword456')).toStrictEqual(400);
    });
  });

  describe('Error cases', () => {
    test('Error when session is invalid', () => {
      const res = adminUserPasswordUpdate('invalid-session', 'password123', 'newPassword456');
      expect(res).toStrictEqual(401);
    });

    test('Error when session is empty', () => {
      const res = adminUserPasswordUpdate('', 'password123', 'newPassword456');
      expect(res).toStrictEqual(401);
    });

    test('Error when old password is incorrect', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'wrongPassword', 'newPassword456');
      expect(res).toStrictEqual(400);

      // old password still works
      const loginResult = adminAuthLogin('user@example.com', 'password123');
      expect(loginResult).toStrictEqual({
        session: expect.any(String)
      });
    });

    test('Error when old and new passwords match exactly', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'password123', 'password123');
      expect(res).toStrictEqual(400);
    });

    test('Error when new password has been used before', () => {
      adminUserPasswordUpdate(sessionToken, 'password123', 'newPassword456');

      const loginResult = adminAuthLogin(
        'user@example.com', 'newPassword456'
      ) as { session: string };
      const newSessionToken = loginResult.session;

      // Try to change back to original password
      const res = adminUserPasswordUpdate(newSessionToken, 'newPassword456', 'password123');
      expect(res).toStrictEqual(400);
    });

    test('Error when new password is less than 8 characters', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'password123', 'short1');
      expect(res).toStrictEqual(400);
    });

    test('Error when new password does not contain at least one number', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'password123', 'passwordonly');
      expect(res).toStrictEqual(400);
    });

    test('Error when new password does not contain at least one letter', () => {
      const res = adminUserPasswordUpdate(sessionToken, 'password123', '12345678');
      expect(res).toStrictEqual(400);
    });
  });
});
