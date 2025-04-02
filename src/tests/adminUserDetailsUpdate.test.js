import {
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
} from '../auth';

import {
  clear,
} from '../other';

let user;

describe('tests for adminUserDetailUpdate', () => {
  beforeEach(() => {
    clear();
    user = adminAuthRegister('123@gmail.com', 'password123', 'my', 'name');
  });

  test('error_msg test for invalid userId', () => {
    const invalidUid = user.userId + 1;

    expect(adminUserDetailsUpdate(invalidUid, '123@gmail.com', 'my', 'name')).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  describe('error_msg tests for NameLast', () => {
    test('NameLast is less than 2 characters', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'Panda', 'P')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('NameLast is more than 20 characters', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(
        uid, 'randomemail@gmail.com', 'Josh', 'Thisisaverylongnameyouseemenow')
      ).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('NameLast contains invalid characters', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(
        uid, 'randomemail@gmail.com', 'Panda', 'mylastname||~~')
      ).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });
  });

  describe('error_msg tests for NameFirst', () => {
    test('NameFirst is less than 2 characters', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'J', 'Panda')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('NameFirst is more than 20 characters', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(
        uid, 'randomemail@gmail.com', 'Thisisaverylongnameyouseemenow', 'Po')
      ).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('NameFirst contains invalid characters', () => {
      const uid = user.userId;

      expect(
        adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'invalid}{|!', 'Po')
      ).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });
  });

  describe('error_msg tests for email', () => {
    test('does not satisfy validator function', () => {
      const uid = user.userId;

      expect(adminUserDetailsUpdate(uid, 'notavalidemail//', 'Joshua', 'Pozz')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('Email address is used by another user.', () => {
      const uid = user.userId;

      adminAuthRegister('studentunsw@gmail.com', 'thisagoodpassword198', 'Joshua', 'Pozz');
      expect(adminUserDetailsUpdate(uid, 'studentunsw@gmail.com', 'Panda', 'Po')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });
  });

  describe('success cases', () => {
    test('all valid fields', () => {
      const uid = user.userId;

      adminUserDetailsUpdate(uid, 'jpozzolungo@gmail.com', 'Joshua', 'Pozzolungo');

      expect(adminUserDetails(uid)).toStrictEqual(
        {
          user: {
            userId: uid,
            name: 'Joshua Pozzolungo',
            email: 'jpozzolungo@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          }
        }
      );
    });
  });
});
