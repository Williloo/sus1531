import {
  adminAuthRegister,
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

  describe('Success cases', () => {
    test('Successfully updates user details', () => {
      const res = adminUserDetailsUpdate(sessionToken, 'updated@example.com', 'Updated', 'Name');
      expect(res).toStrictEqual({});

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.email).toStrictEqual('updated@example.com');
      expect(userDetails.user.name).toStrictEqual('Updated Name');
    });

    test('Can update to same email (no change)', () => {
      expect(adminUserDetailsUpdate(
        sessionToken, 'user@example.com', 'Updated', 'Name'
      )).toEqual({});

      const res = adminUserDetails(sessionToken);
      expect(res.user.email).toStrictEqual('user@example.com');
      expect(res.user.name).toStrictEqual('Updated Name');
    });

    test('Successful update with valid special characters in names', () => {
      expect(adminUserDetailsUpdate(
        sessionToken, 'updated@example.com', "O'Connor", 'Smith-Jones'
      )).toEqual({});

      const res = adminUserDetails(sessionToken);
      expect(res.user.name).toStrictEqual("O'Connor Smith-Jones");
    });
  });

  describe('Error cases', () => {
    test('Error when session is invalid', () => {
      const res = adminUserDetailsUpdate(
        'invalid-session-token', 'updated@example.com', 'Updated', 'Name'
      );
      expect(res).toStrictEqual(401);

      // Verify the details are not updated
      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when session is empty', () => {
      const res = adminUserDetailsUpdate('', 'updated@example.com', 'Updated', 'Name');
      expect(res).toStrictEqual(401);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when first name is invalid with invalid characters', () => {
      const res = adminUserDetailsUpdate(
        sessionToken, 'updated@example.com', 'Invalid@Name', 'Name'
      );
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when first name is too short', () => {
      const res = adminUserDetailsUpdate(sessionToken, 'updated@example.com', 'A', 'Name');
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when first name is too long', () => {
      const res = adminUserDetailsUpdate(sessionToken,'updated@example.com','ThisNameIsMuchTooLongForTheSystem','Name');
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when last name is invalid', () => {
      const res = adminUserDetailsUpdate(
        sessionToken, 'updated@example.com', 'Updated', 'Invalid@Name'
      );
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when last name is too short', () => {
      const res = adminUserDetailsUpdate(sessionToken, 'updated@example.com', 'Updated', 'A');
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when last name is too long', () => {
      const res = adminUserDetailsUpdate(
        sessionToken, 'updated@example.com', 'Updated', 'ThisLastNameIsMuchTooLongForTheSystem'
      );
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when email format is invalid', () => {
      const res = adminUserDetailsUpdate(sessionToken, 'not-an-email', 'Updated', 'Name');
      expect(res).toStrictEqual(400);

      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });

    test('Error when email is already used by another user', () => {
      adminAuthRegister('other@example.com', 'password123', 'Other', 'User');

      // Try to update first user's email to the second user's email
      const res = adminUserDetailsUpdate(sessionToken, 'other@example.com', 'Updated', 'Name');
      expect(res).toStrictEqual(400);

      // details are not updated
      const userDetails = adminUserDetails(sessionToken);
      expect(userDetails.user.name).toStrictEqual('John Doe');
    });
  });
});
