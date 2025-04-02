import { Data, User, Quiz } from './dataStore'

/**
 * Function to check whether user exists in an array of users
 * 
 * @param { number } userId - userId of user that we wish to verify
 * @param { array } users - array of users we search through to check if user exists 
 * @returns { boolean } - whether the user exists or not
 */
export function checkUserExists( userId: number, users: User[] ): boolean {
  return users.some(
    user => user.userId === userId
  )
}

/**
 * Function to access a user by userId
 * 
 * @param { number } userId - userId of the user we wish to access
 * @param { array } users - array of users we search through to access the user
 * @returns { null | User } - null object if user doesn't exist, or user object
 */
export function findUser( userId: number, users: User[] ): null | User {
  let user: null | User = users.find(user => user.userId === userId)

  if (!user) {
    return null
  }

  return user
}

/**
 * Function to check whether a user's name is valid
 * 
 * @param { string } name - name to check
 * @returns { boolean } - whether the user's name is valid
 */
export function checkUserName( name: string ): boolean {
  const userTest: string = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ-' "

  for (const char of name) {
    if (!(userTest.includes(char))) {
      return false;
    }
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
 * @returns { boolean } - whether the password is valid
 */
export function checkPassword( password: string ): boolean {
  const lettersRegex: RegExp = /[a-zA-Z]/
  const numbersRegex: RegExp = /\d/

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
 * @returns { boolean } - whether the quiz name is valid
 */
export function checkQuizName( name: string ): boolean {
  const quizTest: string = "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "

  for (const char of name) {
    if (!(quizTest.includes(char))) {
      return false;
    }
  }
  
  if (name.length < 3) {
    return false
  }
  
  if (name.length > 30) {
    return false
  }

  return true
}

/**
 * Function to check whether a user has already created a quiz
 * 
 * @param { number } userId - userId of user that created the quiz
 * @param { string } name - name of quiz
 * @param { array } quizzes - array of quizzes we search through
 * @returns { boolean } - whether the quiz exists or not
 */
export function checkQuizExists( userId: number, name: string, quizzes: Quiz[] ): boolean {
  let quizExists: boolean = quizzes.some(
    quiz => quiz.creatorId === userId && quiz.name === name
  )

  return quizExists
}

/**
 * Function to access a quiz by its creator's userId and its quizId
 * 
 * @param { number } userId - userId of the quiz's creator
 * @param { number } quizId - quizId of the quiz
 * @param { Array } quizzes - array of quizzes to search through
 * @returns { null | Quiz } - null object if quiz doesn't exist, or quiz object
 */
export function findQuiz( userId: number, quizId: number, quizzes: Quiz[] ): null | Quiz {
  let quiz: null | Quiz = quizzes.find(quiz => quiz.quizId === quizId)

  if (!quiz) {
    return null
  }

  if (quiz.creatorId !== userId) {
    return null
  }

  return quiz
}