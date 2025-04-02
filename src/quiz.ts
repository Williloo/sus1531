import {
  getData, updateData,
  Data, Quiz, Error, QuizDetails, EmptyObject
} from './dataStore';

import {
  checkUserExists,
  checkQuizName,
  checkQuizExists,
  findQuiz,
} from './helpers';

/**
 * This function provides a list of all the quizzes owned by the currently logged in user
 *
 * @param { number } userId - The userId of the currently logged in user
 *
 * @returns { Object } - Empty object
 */
export function adminQuizList(userId: number): Error | { quizzes: QuizDetails[] } {
  const store: Data = getData();

  // Check if userId exists
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'userId is not a valid user.' };
  }

  // Find all quizzes made by the user
  const userQuizzes: Quiz[] = store.quizzes.filter(quiz => quiz.creatorId === userId);
  const res: QuizDetails[] = userQuizzes.map(
    quiz => ({ quizId: quiz.quizId, name: quiz.name })
  );

  // Return only quizId and name of each quiz
  return { quizzes: res };
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
export function adminQuizCreate(
  userId: number, name: string, description: string
): Error | { quizId: number } {
  const store: Data = getData();

  // Check if userId is valid
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'userId is not a valid user.' };
  }

  // Check if quizName is valid
  if (!checkQuizName(name)) {
    return { error_msg: 'Invalid quiz name' };
  }

  // Check if user already created quiz with same name
  if (checkQuizExists(userId, name, store.quizzes)) {
    return { error_msg: 'Name is already used by the same user' };
  }

  // Check description length
  if (description.length > 100) {
    return { error_msg: 'Description is too long' };
  }

  // Generate new userId
  const quizId: number = store.quizCreated;
  store.quizCreated++;

  const timestamp: number = Math.floor(Date.now() / 1000);

  // Add new quiz to store
  const newQuiz: Quiz = {
    quizId,
    creatorId: userId,
    name,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    description
  };
  store.quizzes.push(newQuiz);

  // Update Data after Done
  updateData(store);

  return { quizId };
}

/**
 * This function is used to permanently remove a particular quiz
 *
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz to be deleted
 *
 * @returns { Object } - Empty object
 */
export function adminQuizRemove(
  userId: number, quizId: number
): Error | EmptyObject {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'Not A Valid User' };
  }

  // Search for existing quiz
  const quiz: null | Quiz = findQuiz(userId, quizId, store.quizzes);
  if (!quiz) {
    return { error_msg: 'Quiz does not exist' };
  }

  // Find index of quiz and remove from data
  const index: number = store.quizzes.findIndex(
    quizzes => quizzes.quizId === quiz.quizId
  );
  store.quizzes.splice(index, 1);

  // Update Data after Done
  updateData(store);

  return {};
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
export function adminQuizInfo (userId: number, quizId: number): Error | QuizDetails {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'Not A Valid User' };
  }

  // Search for existing quiz
  const quiz: null | Quiz = findQuiz(userId, quizId, store.quizzes);
  if (!quiz) {
    return { error_msg: 'Quiz does not exist' };
  }

  // Update Data after Done
  updateData(store)

  // Return information about the quiz
  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  };
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
export function adminQuizNameUpdate(
  userId: number, quizId: number, name: string
): Error | EmptyObject {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'userId is not a valid user.' };
  }

  // Search for existing quiz
  const quiz: null | Quiz = findQuiz(userId, quizId, store.quizzes);
  if (!quiz) {
    return { error_msg: 'Quiz does not exist' };
  }

  // Check if valid quizName
  if (!checkQuizName(name)) {
    return { error_msg: 'Invalid quiz name' };
  }

  // Check if user already created quiz with same name
  if (checkQuizExists(userId, name, store.quizzes)) {
    return { error_msg: 'Name is already used by the current logged in user for another quiz.' };
  }

  // Update name and time modified of quiz
  quiz.name = name;
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Update Data after Done
  updateData(store);

  return {};
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
export function adminQuizDescriptionUpdate(
  userId: number, quizId: number, description: string
): Error | EmptyObject {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return { error_msg: 'userId is not a valid user.' };
  }

  // Search for existing quiz
  const quiz: null | Quiz = findQuiz(userId, quizId, store.quizzes);
  if (!quiz) {
    return { error_msg: 'Quiz does not exist' };
  }

  // Check if description length is valid
  if (description.length > 100) {
    return { error_msg: 'Description is more than 100 characters in length.' };
  }

  // Update description and time modified
  quiz.description = description
  quiz.timeLastEdited = Math.floor(Date.now() / 1000)
  
  // Update Data after Done
  updateData(store);
  
  return {};
}
