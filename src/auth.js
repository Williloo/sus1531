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

import { getData } from './dataStore.js';
import validator from 'validator';

export function adminAuthRegister( email, password, nameFirst, nameLast ) {
  
  let data = getData();
  if (data.users.length !== 0) {
    for (let user of data.users) {
      if (email === user.email) {
        return { error: 'Email address is already in use'}; 
      }
    }
  }

  const userRegex = /^[a-zA-Z-' ]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
  if (!(userRegex.test(nameFirst))) {
    return { error: 'First Name contains invalid characters'}; 
  }
  else if (!(userRegex.test(nameLast))) {
    return { error: 'Last Name contains invalid characters'}; 
  }
  else if (!(passwordRegex.test(password))) {
    return { error: 'Password does not contain at least one number and at least one letter.'};
  }
  else if (!(validator.isEmail(email))) {
    return { error: 'Invalid email'}; 
  }
  else if (password.length < 8) {
    return { error: 'Password is less than 8 characters'};
  }
  else if (nameFirst.length < 2) {
    return { error: 'First Name is less than 2 characters'};
  }
  else if (nameFirst.length > 20) {
    return { error: 'First Name is greater than 20 characters'};
  }
  else if (nameLast.length < 2) {
    return { error: 'Last Name is less than 2 characters'};
  }
  else if (nameLast.length > 20) {
    return { error: 'Last Name is greater than 20 characters'};
  }

  const userId = data.users.length;
  const newUser = {
    userId,
    nameFirst,
    nameLast,
    email,
    password,
    numSuccessfulLogins : 0,
    numFailedPasswordsSinceLastLogin : 0
  }
  data.users.push(newUser);

  return { userId }
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
export function adminAuthLogin( email, password ) {
  let data = getData()

  for (const user of data.users) {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      if (password === user.password) {
        user.numSuccessfulLogins++;
        return { userId: user.userId }
      }
      else {
        user.numFailedPasswordsSinceLastLogin++;
        return { error: 'Password is not correct for given email'}
      }
    }
  }

  return { error: 'Email address does not exist'};
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
 * @property { string } name - The user's first and last name concatenated with a single space between them
 * @property { string } email - The email of the user
 * @property { number } numSuccessfulLogins - Number of successful logins of the user
 * @property { number } numFailedPasswordsSinceLastLogin - Number of failed password attempts of the user since the last login
 */
export function adminUserDetails( userId ) {
  let store = getData()

  if (!store.users.some(user => user.userId === userId)) {
    return {error: 'Not A Valid User'};
  } 

  let user = store.users[userId]

  return { user:
    {
      userId: userId,
      name: user.nameFirst + ' ' + user.nameLast,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  }
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
export function adminUserDetailsUpdate( userId, email, nameFirst, nameLast ) {
  let store = getData();

  if (!store.users.some(user => user.userId === userId)) {
    return {error: 'Not A Valid User'};
  } 
  
  for (let user of store.users) {
    if (email === user.email) {
      return { error: 'Email address is already in use'}; 
    }
  }

  const userRegex = /^[a-zA-Z-' ]+$/;
  if (!(userRegex.test(nameFirst))) {
    return { error: 'First Name contains invalid characters'}; 
  }
  else if (!(userRegex.test(nameLast))) {
    return { error: 'Last Name contains invalid characters'}; 
  }
  else if (!(validator.isEmail(email))) {
    return { error: 'Invalid email'}; 
  }
  else if (nameFirst.length < 2) {
    return { error: 'First Name is less than 2 characters'};
  }
  else if (nameFirst.length > 20) {
    return { error: 'First Name is greater than 20 characters'};
  }
  else if (nameLast.length < 2) {
    return { error: 'Last Name is less than 2 characters'};
  }
  else if (nameLast.length > 20) {
    return { error: 'Last Name is greater than 20 characters'};
  }

  let user = store.users[userId]
  user.email = email
  user.nameFirst = nameFirst
  user.nameLast = nameLast

  return {  }
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
export function adminUserPasswordUpdate( userId, oldPassword, newPassword ) {
  let store = getData()

  if (!store.users.some(user => user.userId === userId)) {
    return {error: 'Not A Valid User'};
  } 

  let user = store.users[userId]
  if (user.password !== oldPassword) {
    return { error: "Invalid password" }
  }

  if (oldPassword === newPassword) {
    return { error: "Invalid new password" }
  }

  if (!user.hasOwnProperty('pastPasswords')) {
    user.pastPasswords = []
  }

  if (user.pastPasswords.includes(newPassword)) {
    return { error: "Invalid new password" }
  }

  if (newPassword.length < 8) {
    return { error: "New password longer than  8 characters" }
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/

  if (!passwordRegex.test(newPassword)) {
    return { error: "New password does not contain a letter or a number" }
  }

  user.pastPasswords.push(user.password)
  user.password = newPassword

  return {  }
}
