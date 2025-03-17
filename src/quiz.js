import { getData } from './dataStore.js'
import { 
  checkUserExists,
  checkQuizName,
  checkQuizExists,
  findQuiz,
} from './helpers.js'

/** 
 * This function provides a list of all the quizzes owned by the currently logged in user
 * 
 * @param { number } userId - The userId of the currently logged in user
 * 
 * @returns { Object } - Empty object
 */
export function adminQuizList( userId ) {
  let store = getData()

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  // Find all quizzes made by the user
  let userQuizzes = store.quizzes.filter(quiz => quiz.creatorId === userId)
  
  // Return only quizId and name of each quiz
  return { 
    quizzes: userQuizzes.map(
      ({ quizId, name }) => ({ quizId, name })
    )
  }
}

/**
 * This function takes in the userId, name and description of a new quiz,
 * creates it, and returns its quizId 
 * 
 * @param { number } userId - The userId of the user creating the quiz
 * @param { string } name - The name of the quiz
 * @param { string } description - A description of the quiz
 * 
 * @returns { Object } - Empty object
 */
export function adminQuizCreate( userId, name, description ) {
  let store = getData()
  
  //Check if userId is valid
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  // Check if quizName is valid
  if (!checkQuizName(name)) {
    return { error: 'Invalid quiz name' }
  }
  
  // Check if user already created quiz with same name
  if (checkQuizExists(userId, name, store.quizzes)) {
    return { error: 'Name is already used by the same user' }
  }

  // Check description length
  if (description.length > 100) {
    return { error: 'Description is too long' }
  }

  // Initialise property quizCreated in store if not existent
  if (!store.hasOwnProperty('quizCreated')) {
    store.quizCreated = 0
  }

  // Generate new userId
  const quizId = store.quizCreated
  store.quizCreated++

  const timestamp = Math.floor(Date.now() / 1000)

  // Add new quiz to store
  const newQuiz = {
    quizId,
    creatorId: userId,
    name,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    description
  }
  store.quizzes.push(newQuiz)

  return { quizId }
}

/** 
 * This function is used to permanently remove a particular quiz
 * 
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz to be deleted
 * 
 * @returns { Object } - Empty object
 */
export function adminQuizRemove( userId, quizId ) {
  let store = getData()

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Not A Valid User' }
  } 

  // Search for existing quiz
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: "Quiz does not exist" }
  }

  // Find index of quiz and remove from data
  const index = store.quizzes.indexOf(quiz)
  store.quizzes.splice(index, 1)

  return {  }
}

/**
 * This function gets all of the relevant information about current quiz
 * 
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz
 * 
 * @returns { Object }
 * 
 * @typedef { Object }
 * @property { number } quizId - The quizId of the quiz
 * @property { string } name - The name of the quiz
 * @property { number } timeCreated - The time that the quiz was created
 * @property { number } timeLastEdited - The time the quiz was last editted
 * @property { string } description - The description of the quiz
 */
export function adminQuizInfo ( userId, quizId ) {
  let store = getData()

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Not A Valid User' }
  } 

  // Search for existing quiz
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }

  // Return information about the quiz
  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  }
}

/**
 * Function to update the name of the relevant quiz
 * 
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz
 * @param { string } name - The name of the quiz
 * 
 * @returns { Object } - Empty object
 */
export function adminQuizNameUpdate( userId, quizId, name ) {
  let store = getData()

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  // Search for existing quiz
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }
  
  // Check if valid quizName
  if (!checkQuizName(name)) {
    return { error: 'Invalid quiz name' }
  }

  // Check if user already created quiz with same name
  if (checkQuizExists(userId, name, store.quizzes)) {
    return { error: 'Name is already used by the current logged in user for another quiz.' }
  }
  
  // Update name and time modified of quiz
  quiz.name = name
  quiz.timeLastEdited = Math.floor(Date.now() / 1000)

  return {  }
}

/**
 * This function updates the description of the relevant quiz
 * 
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz
 * @param { string } description - The description of the quiz
 * 
 * @returns { Object }
 */
export function adminQuizDescriptionUpdate( userId, quizId, description ) {
  let store = getData()
  
  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  // Search for existing quiz
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }

  // Check if description length is valid
  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length.' }
  }
  
  // Update description and time modified
  quiz.description = description
  quiz.timeLastEdited = Math.floor(Date.now() / 1000)
  
  return {  }
}