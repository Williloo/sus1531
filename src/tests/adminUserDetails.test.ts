import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  clear
} from '../requests';

describe('PUT /v1/admin/user/details', () => {
  let sessionToken: string;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister('user@example.com', 'password123', 'John', 'Doe');
    sessionToken = registerResult.session;
  });

  // TO DO CHECK
  describe('Success cases', () => {
    test('Successfully returns user details and numSuccessfulLogins are tracked', () => {
      adminAuthLogin('user@example.com', 'password123');
      const res = adminUserDetails(sessionToken);

      expect(res).toStrictEqual({
        user: {
          userId: sessionToken,
          name: 'John Doe',
          email: 'user@example.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
    });

    test('numFailedPasswordsSinceLastLogin are tracked', () => {
      // TO DO: numFailedPasswordsSinceLastLogin is reset every time they have a
      // successful login, and simply counts the number of attempted logins that
      // failed due to incorrect password, only since the last login
    });

    test('numFailedPasswordsSinceLastLogin resetted to zero after a succesful login', () => {
      // TO DO: numFailedPasswordsSinceLastLogin is reset every time they have a
      // successful login, and simply counts the number of attempted logins that
      // failed due to incorrect password, only since the last login
    });
  });

  describe('Error cases', () => {
    test('Error when session is invalid', () => {
      const res = adminUserDetailsUpdate(
        'invalid-session-token', 'updated@example.com', 'Updated', 'Name'
      );
      expect(res).toStrictEqual(401);
    });

    test('Error when session is empty', () => {
      const res = adminUserDetailsUpdate('', 'updated@example.com', 'Updated', 'Name');
      expect(res).toStrictEqual(401);
    });
  });
});
