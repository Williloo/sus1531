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