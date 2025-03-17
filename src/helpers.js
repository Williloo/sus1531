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