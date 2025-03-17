/**
 * Function to check whether user exists in an array of users
 * 
 * @param { number } userId - userId of user that we wish to verify
 * @param { array } users - array ofo users we search through to check if user exists 
 * @returns { Boolean } - whether the user exists or not
 */
export function checkUserExists( userId, users ) {
  return users.some(
    user => user.userId === userId
  )
}

/**
 * Function to check whether a user's name is valid
 * 
 * @param { string } name - name to check
 * @returns { Boolean } - whether the user's name is valid
 */
export function checkUserName( name ) {
  const userRegex = /^[a-zA-Z\s\-']*$/

  if (!userRegex.test(name)) {
    return false
  }

  if (name.length < 2 || name.length > 20) {
    return false
  }

  return true
}