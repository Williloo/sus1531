import {
  getData, updateData,
  Data, User, Error, UserDetails, EmptyObject
} from './dataStore';

import {
  createSessionId,
  pairUserIdSessionId,
  getUserIdBySessionId
} from './session'

import {
  checkUserExists,
  checkUserName,
  checkPassword,
  findUser,
} from './helpers';
import validator from 'validator';

/**
* Register a user with an email, password and names
* then return their userId value.
*
* @param { string } email - The email fo the user being registered
* @param { string } password - The password of the user being registered
* @param { string } nameFirst - The first name of the user being registered
* @param { string } nameLast - The last name of the user being registered
*
* @returns { Object }
*
* @typedef { Object }
* @property { number } userId - The user id of the user that has been registered
*/
export function adminAuthRegister(
  email: string, password: string, nameFirst: string, nameLast: string
): Error | { userId: number } {
  const store: Data = getData();

  // Check if email already exists
  for (const user of store.users) {
    if (email === user.email) {
      return {
        error_msg: 'Email address is already in use',
        error_code: 400
      };
    }
  }

  // Check if names are valid
  if (!checkUserName(nameFirst)) {
    return {
      error_msg: 'Invalid first name',
      error_code: 400
    };
  }

  if (!checkUserName(nameLast)) {
    return {
      error_msg: 'Invalid last name',
      error_code: 400
    };
  }

  // Check if password is valid
  if (!checkPassword(password)) {
    return {
      error_msg: 'Invalid password',
      error_code: 400
    };
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    return {
      error_msg: 'Invalid email',
      error_code: 400
    };
  }

  // Generate new userId
  const userId: number = store.usersCreated;
  store.usersCreated++;

  // Add user to store
  const newUser: User = {
    userId: userId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    pastPasswords: []
  };
  store.users.push(newUser);

  const sessionId = createSessionId();
  pairUserIdSessionId(store, userId, sessionId);

  // Update Data after Done
  updateData(store);

  // Return new userId
  return { userId };
}

/**
* Given a registered user's email and password,
* return their userId value.
*
* @param { string } email - The email of the user logging in
* @param { string } password - The password of the user logging in
*
* @returns { Object }
*
* @typedef { Object }
* @property { number } userId - The userId of the user loogging in
*/
export function adminAuthLogin(email: string, password: string): Error | { userId: number } {
  const store: Data = getData();

  for (const user of store.users) {
    // Check if emails matches
    if (email.toLowerCase() === user.email.toLowerCase()) {
      // Check if passwords match
      if (password === user.password) {
        user.numSuccessfulLogins++;
        user.numFailedPasswordsSinceLastLogin = 0;

        // Update Data after Done
        updateData(store);

        return { userId: user.userId };
      } else {
        user.numFailedPasswordsSinceLastLogin++;
        return {
          error_msg: 'Password is not correct for given email',
          error_code: 400
        };
      }
    }
  }

  // Invalid email address
  return {
    error_msg: 'Email address does not exist',
    error_code: 400
  };
}

/**
 * This function takes an userId and returns information about the user
 * in an user object
 *
 * @param { number } userId - The Id of the user whose details are returned
 *
 * @returns { Object }
 *
 * @typedef { Object }
 * @property { User } user - Object containing information about the user
 *
 * @property { number } userId - The userId of the user
 * @property { string } name - The user's first and last name concatenated with a space between them
 * @property { string } email - The email of the user
 * @property { number } numSuccessfulLogins - Number of successful logins of the user
 * @property { number } numFailedPasswordsSinceLastLogin - Number of failed password attempts
 *                                                         of the user since the last login
 */
export function adminUserDetails(userId: number): Error | UserDetails {
  const store: Data = getData();

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'Invalid User Id',
      error_code: 401
    };
  }

  // Find the user
  const user: null | User = findUser(userId, store.users);
  if (!user) {
    return {
      error_msg: 'User does not exist',
      error_code: 401
    };
  }

  // Return information about the user
  return {
    user:
    {
      userId: userId,
      name: user.nameFirst + ' ' + user.nameLast,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
 * Given a set of properties and the userId of an admin user, this function
 * updates those properties of the user
 *
 * @param { number } userId - The userId of the user
 * @param { string } email - The email of the user
 * @param { string } nameFirst - The first name of the user
 * @param { string } nameLast - The last name of the user
 *
 * @returns { Object } - Empty object
 */
export function adminUserDetailsUpdate(
  userId: number, email: string, nameFirst: string, nameLast: string
): Error | EmptyObject {
  const store: Data = getData();

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'Invalid User Id',
      error_code: 401
    };
  }

  // Check if email already in use
  for (const user of store.users) {
    if (email === user.email) {
      return {
        error_msg: 'Email address is already in use',
        error_code: 400
      };
    }
  }

  // Check if names are valid
  if (!checkUserName(nameFirst)) {
    return {
      error_msg: 'Invalid first name',
      error_code: 400
    };
  }

  if (!checkUserName(nameLast)) {
    return {
      error_msg: 'Invalid last name',
      error_code: 400
    };
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    return {
      error_msg: 'Invalid email',
      error_code: 400
    };
  }

  // Find the user
  const user: null | User = findUser(userId, store.users);
  if (!user) {
    return {
      error_msg: 'User does not exist',
      error_code: 400
    };
  }

  // Update user details
  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  // Update Data after Done
  updateData(store);

  return {};
}

/**
 * Given the userId of a user and their old password, updates the user's password from oldPassword
 * to newPassword
 *
 * @param { number } userId - The userId of the user
 * @param { string } oldPassword - The old password of the user
 * @param { string } newPassword - The new password of the user
 *
 * @returns { Object } - Empty object
 */
export function adminUserPasswordUpdate(
  userId: number, oldPassword: string, newPassword: string
): EmptyObject | Error {
  const store: Data = getData();

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'Invalid User Id',
      error_code: 401
    };
  }

  // Find the user
  const user: null | User = findUser(userId, store.users);
  if (!user) {
    return {
      error_msg: 'User does not exist',
      error_code: 401
    };
  }

  // Check if correct old password
  if (user.password !== oldPassword) {
    return {
      error_msg: 'Invalid password',
      error_code: 400
    };
  }

  // Check if password is unchanged
  if (oldPassword === newPassword) {
    return {
      error_msg: 'Invalid new password',
      error_code: 400
    };
  }

  // Check if password has been used before
  if (user.pastPasswords.includes(newPassword)) {
    return {
      error_msg: 'Invalid new password',
      error_code: 400
    };
  }

  // Check if new password is valid
  if (!checkPassword(newPassword)) {
    return {
      error_msg: 'Invalid new password',
      error_code: 400
    };
  }

  // Update user password
  user.pastPasswords.push(user.password);
  user.password = newPassword;

  // Update Data after Done
  updateData(store);
  return {};
}
