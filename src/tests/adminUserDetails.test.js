import {
  clear,
} from '../other';

import {
  adminAuthRegister,
  adminUserDetails,
} from '../auth';

let user;

describe('tests for adminUserDetails', () => {
  beforeEach(() => {
    clear();
    user = adminAuthRegister('123@gmail.com', 'password123', 'my', 'name');
  });

  test('invalid user id', () => {
    const invalidUid = user.userId + 1;

    expect(adminUserDetails(invalidUid)).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('valid user id', () => {
    const uid = user.userId;
    expect(adminUserDetails(uid)).toStrictEqual(
      {
        user: {
          userId: uid,
          name: 'my name',
          email: '123@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });

  test('multiple users', () => {
    const user2 = adminAuthRegister('456@gmail.com', 'password456', 'your', 'moniker');
    const uid1 = user.userId;
    const uid2 = user2.userId;

    expect(adminUserDetails(uid1)).toStrictEqual(
      {
        user: {
          userId: uid1,
          name: 'my name',
          email: '123@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );

    expect(adminUserDetails(uid2)).toStrictEqual(
      {
        user: {
          userId: uid2,
          name: 'your moniker',
          email: '456@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });
});
