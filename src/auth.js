

/*
* Register a user with an email, password and names 
* then return their userId value.
*
* @param {string} email
* @param {string} password
* @param {string} nameFirst
* @param {string} nameLast
* @returns {Object}
*
* @typdef {Object}
* @property {number} userId
*/

function adminAuthRegister( email, password, nameFirst, nameLast ) {
  return {
    userId: 1
  }
}


/*
* Given a registered user's email and password, 
* return their userId value.
*
* @param {string} email
* @param {string} password
* @returns {Object}
*
* @typdef {Object}
* @property {number} userId
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
 * @param { Number } userId 
 * @returns { Object }
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
 * @param { Number } userId 
 * @param { String } email 
 * @param { String } nameFirst 
 * @param { String } nameLast 
 * @returns { Object }
 */
function adminUserDetailsUpdate( userId, email, nameFirst, nameLast ) {
    return { }
}

/**
 * Given the userId of a user and their old password, updates the user's password from oldPassword
 * to newPassword
 *
 * @param { Number } userId
 * @param { String } oldPassword
 * @param { String } newPassword
 * @returns { Object }
 */
function adminUserPasswordUpdate( userId, oldPassword, newPassword ) {
    return { }
}


