import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  clear
} from '../requests';

import {
  UserDetails
} from '../interface';

describe('tests for adminUserDetails', () => {
  let sessionToken: string;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'user@example.com', 'password123', 'John', 'Doe'
    ) as { session: string };
    sessionToken = registerResult.session;
  });

  // TO DO CHECK
  describe('Success cases', () => {
    test('Successfully returns user details and numSuccessfulLogins are tracked', () => {
      adminAuthLogin('user@example.com', 'password123');
      const res = adminUserDetails(sessionToken);

      expect(res).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'John Doe',
          email: 'user@example.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });

      test('Name is correctly formed from first and last name', () => {
        const res = adminUserDetails(sessionToken) as { user: UserDetails };
        expect(res.user.name).toStrictEqual('John Doe');
      });
      test('numFailedPasswordsSinceLastLogin are tracked', () => {
        // TO DO CHECK
        adminAuthLogin('user@example.com', 'wrongpassword');
        adminAuthLogin('user@example.com', 'wrongpassword');

        const res = adminUserDetails(sessionToken) as { user: UserDetails };
        expect(res.user.numFailedPasswordsSinceLastLogin).toBe(2);
      });

      test('numFailedPasswordsSinceLastLogin reset to zero after a successful login', () => {
        adminAuthLogin('user@example.com', 'wrongpassword');
        adminAuthLogin('user@example.com', 'wrongpassword');

        let res = adminUserDetails(sessionToken) as { user: UserDetails };
        expect(res.user.numFailedPasswordsSinceLastLogin).toBe(2);

        adminAuthLogin('user@example.com', 'password123');

        res = adminUserDetails(sessionToken) as { user: UserDetails };
        expect(res.user.numFailedPasswordsSinceLastLogin).toBe(0);
      });
    });
  });

  describe('Error cases', () => {
    test('Error when session is invalid', () => {
      const res = adminUserDetails('invalid-session-token');
      expect(res).toStrictEqual(401);
    });

    test('Error when session is empty', () => {
      const res = adminUserDetails('');
      expect(res).toStrictEqual(401);
    });
  });
});
