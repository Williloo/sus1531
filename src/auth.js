/**
* Register a user with an email, password and names 
* then return their userId value.
*
* @param { string } email - The email fo the user being registered
* @param { string } password - The password of the user being registered
* @param { string } nameFirst - The first name of the user being registered
* @param { string } nameLast - The last name of the user being registered
* @returns { Object }
*
* @typdef { Object }
* @property { number } userId - The user id of the user that has been registered
*/
function adminAuthRegister( email, password, nameFirst, nameLast ) {
  return {
    userId: 1
  }
}

/**
* Given a registered user's email and password, 
* return their userId value.
*
* @param { string } email - The email of the user logging in
* @param { string } password - The password of the user logging in
* @returns { Object } 
*
* @typdef { Object }
* @property { number } userId - The userId of the user loogging in
*/
function adminAuthLogin( email, password ) {
  return {
    userId: 1 
  }
}

/**
 * This function takes an userId and returns information about the user
 * in an user object
 * 
 * @param { number } userId - The Id of the user whose details are returned
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
function adminUserDetails( userId ) {
    return { user:
        {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
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
 * @returns { Object } - Empty object
 */
function adminUserDetailsUpdate( userId, email, nameFirst, nameLast ) {
    return { }
}

/**
 * Given the userId of a user and their old password, updates the user's password from oldPassword
 * to newPassword
 *
 * @param { number } userId - The userId of the user
 * @param { string } oldPassword - The old password of the user
 * @param { string } newPassword - The new password of the user
 * @returns { Object } - Empty object
 */
function adminUserPasswordUpdate( userId, oldPassword, newPassword ) {
    return { }
}