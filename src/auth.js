import { getData } from './dataStore.js'
import { 
  checkUserExists,
  checkUserName,
  checkPassword,
} from './helpers.js'
import validator from 'validator'

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
export function adminAuthRegister( email, password, nameFirst, nameLast ) {
  let data = getData()

  // Check if email already exists
  for (let user of data.users) {
    if (email === user.email) {
      return { error: 'Email address is already in use' }
    }
  }

  // Check if names are valid
  if (!checkUserName(nameFirst)) {
    return { error: 'Invalid first name' }
  }

  if (!checkUserName(nameLast)) {
    return { error: 'Invalid last name' }
  }
  
  // Check if password is valid
  if (!checkPassword(password)) {
    return { error: 'Invalid password' }
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    return { error: 'Invalid email' }
  }

  // Add new user to data
  const userId = data.users.length
  const newUser = {
    userId,
    nameFirst,
    nameLast,
    email,
    password,
    numSuccessfulLogins : 0,
    numFailedPasswordsSinceLastLogin : 0
  }
  data.users.push(newUser)

  // Return new userId
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
    // Check if emails matches
    if (email.toLowerCase() === user.email.toLowerCase()) {
      // Check if passwords match
      if (password === user.password) {
        user.numSuccessfulLogins++
        user.numFailedPasswordsSinceLastLogin = 0

        return { userId: user.userId }
      }
      else {
        user.numFailedPasswordsSinceLastLogin++
        return { error: 'Password is not correct for given email' }
      }
    }
  }

  // Invalid email address
  return { error: 'Email address does not exist' }
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

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Invalid User Id' }
  }

  let user = store.users[userId]

  // Return information about the user
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
  let store = getData()

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Invalid User Id' }
  }
  
  // Check if email already in use
  for (let user of store.users) {
    if (email === user.email) {
      return { error: 'Email address is already in use' }; 
    }
  }

  // Check if names are valid
  if (!checkUserName(nameFirst)) {
    return { error: 'Invalid first name' }
  }

  if (!checkUserName(nameLast)) {
    return { error: 'Invalid last name' }
  }
  
  // Check if email is valid
  if (!validator.isEmail(email)) {
    return { error: 'Invalid email' }
  }

  // Update user details
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

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Invalid User Id' }
  }

  let user = store.users[userId]
  // Check if correct old password
  if (user.password !== oldPassword) {
    return { error: 'Invalid password' }
  }

  // Check if password is unchanged
  if (oldPassword === newPassword) {
    return { error: 'Invalid new password' }
  }

  // Generate new property 'pastPasswords' if passwords have not been changed before
  if (!user.hasOwnProperty('pastPasswords')) {
    user.pastPasswords = []
  }

  // Check if password has been used before
  if (user.pastPasswords.includes(newPassword)) {
    return { error: 'Invalid new password' }
  }

  // Check if new password is valid
  if (!checkPassword(newPassword)) {
    return { error: 'Invalid new password' }
  }

  // Update user password
  user.pastPasswords.push(user.password)
  user.password = newPassword

  return {  }
}
