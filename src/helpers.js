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
  const userRegex = /^[a-zA-Z\s]*$/

  if (!userRegex.test(name)) {
    return false
  }

  if (name.length < 2 || name.length > 20) {
    return false
  }

  return true
}

/**
 * Function to check whether a password is valid
 * 
 * @param { string } password - password to check
 * @returns { Boolean } - whether the password is valid
 */
export function checkPassword( password ) {
  const lettersRegex = /[a-zA-Z]/
  const numbersRegex = /\d/

  if (password.length < 8) {
    return false
  }

  if (!lettersRegex.test(password)) {
    return false
  }

  if (!numbersRegex.test(password)) {
    return false
  }

  return true
}

/**
 * Function to check whether a quiz name is valid
 * 
 * @param { string } name - quiz name to check
 * @returns { Boolean } - whether the quiz name is valid
 */
export function checkQuizName( name ) {
  const quizNameRegex = /^[a-zA-Z0-9\s]*$/

  if (!quizNameRegex.test(name)) {
    return false
  }
  
  if (name.length < 3) {
    return false
  }
  
  if (name.length > 30) {
    return false
  }

  return true
}