import {
  clear,
} from '../other';

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserPasswordUpdate,
} from '../auth';

let user;

describe('tests for adminUserPasswordUpdate', () => {
  beforeEach(() => {
    clear();
    user = adminAuthRegister('123@gmail.com', 'password123', 'my', 'name');
  });

  test('invalid user id', () => {
    const invalidUid = user.userId + 1;

    expect(adminUserPasswordUpdate(invalidUid)).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('incorrect old password', () => {
    const uid = user.userId;

    expect(adminUserPasswordUpdate(uid, 'password456', 'some random old text')).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('old and new password match exactly', () => {
    const uid = user.userId;

    expect(adminUserPasswordUpdate(uid, 'password123', 'password123')).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('new password used before', () => {
    const uid = user.userId;
    adminUserPasswordUpdate(uid, 'password123', 'password456');

    expect(adminUserPasswordUpdate(uid, 'password456', 'password123')).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('new password less than 8 characters', () => {
    const uid = user.userId;

    expect(adminUserPasswordUpdate(uid, 'password123', 'short')).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  describe('new password does not contain at least 1 number or constter', () => {
    test('no number', () => {
      const uid = user.userId;

      expect(adminUserPasswordUpdate(uid, 'password123', '1234567')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });

    test('no constter', () => {
      const uid = user.userId;

      expect(adminUserPasswordUpdate(uid, 'password123', 'abcdefg')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
    });
  });

  test('success case', () => {
    const uid = user.userId;

    adminUserPasswordUpdate(uid, 'password123', 'password456');

    expect(adminAuthLogin('123@gmail.com', 'password456')).toStrictEqual(
      { userId: uid }
    );
  });
});
