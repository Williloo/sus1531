import {
  adminAuthRegister,
  adminAuthLogin,
  clear
} from '../requests';

describe('tests for adminAuthLogin', () => {
  beforeEach(() => {
    clear();

    adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    );
  });

  describe('Error tests', () => {
    test('email address does not exist', () => {
      const result = adminAuthLogin('doesnotexist@gmail.com', 'goodpassword123');
      expect(result).toStrictEqual(400);
    });

    test('password is not correct for given email', () => {
      const result = adminAuthLogin('jpozzolungo@gmail.com', 'incorrectpassword123');
      expect(result).toStrictEqual(400);
    });
  });

  describe('success tests', () => {
    test('correct return value', () => {
      const result = adminAuthLogin('jpozzolungo@gmail.com', 'thisisagoodpassword1974');
      expect(result).toStrictEqual({
        session: expect.any(String)
      });
    });

    test('email address is case insensitive', () => {
      const result = adminAuthLogin('JPOZZOLUNGO@GMAIL.COM', 'thisisagoodpassword1974');
      expect(result).toStrictEqual({ session: expect.any(String) });
    });
  });
});
