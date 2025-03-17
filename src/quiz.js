import { getData } from './dataStore.js'
import { 
  checkUserExists,
  checkQuizName,
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

  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  let userQuizzes = store.quizzes.filter(quiz => quiz.creatorId === userId)
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
 
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  if (!checkQuizName(name)) {
    return { error: 'Invalid quiz name' }
  }
  
  let userQuizzes = store.quizzes.filter(quiz => quiz.creatorId === userId)
  if (userQuizzes.some(quiz => quiz.name === name)) {
    return { error: 'Name is already used by the same user' }
  }

  if (description.length > 100) {
    return { error: 'Description is too long' }
  }

  const quizId = store.quizzes.length + 1
  const timestamp = Math.floor(Date.now() / 1000)

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

  if (!checkUserExists(userId, store.users)) {
    return { error: 'Not A Valid User' }
  } 

  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: "Quiz does not exist" }
  }

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
  if (!checkUserExists(userId, store.users)) {
    return { error: 'Not A Valid User' }
  } 

  /**assume quizId is one of the element name for store.quizzes*/
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }

  /**
   * assume all elements in quiz object is initialised in adminQuizCreate
   * 
   * I can just return Quiz, but there might be some other variable being 
   * added later on that we do not need to return for this function.
  */
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

  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }
  
  if (!checkQuizName(name)) {
    return { error: 'Invalid quiz name' }
  }

  let nameExists = store.quizzes.some(
    q => q.name === name && q.quizId !== quizId && q.creatorId === userId
  )
  if (nameExists) {
    return { error: 'Name is already used by the current logged in user for another quiz.' }
  }
  
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
 
  if (!checkUserExists(userId, store.users)) {
    return { error: 'userId is not a valid user.' }
  }
  
  let quiz = findQuiz(userId, quizId, store.quizzes)
  if (!quiz) {
    return { error: 'Quiz does not exist' }
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length.' }
  }
  
  quiz.description = description
  quiz.timeLastEdited = Math.floor(Date.now() / 1000)
  
  return {  }
}