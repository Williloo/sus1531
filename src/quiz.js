import { getData } from './dataStore.js';

/** 
 * This function provides a list of all the quizzes owned by the currently logged in user
 * 
 * @param { number } userId - The userId of the currently logged in user
 * 
 * @returns { Object } - Empty object
 */
function adminQuizList( userId ) {
  return { quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
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
function adminQuizCreate( userId, name, description ) {
  return {
    quizId: 2
  }
}

/** 
 * This function is used to permanently remove a particular quiz
 * 
 * @param { number } userId - The userId of the creator of the quiz
 * @param { number } quizId - The quizId of the quiz to be deleted
 * 
 * @returns { Object } - Empty object
 */
function adminQuizRemove( userId, quizId ) {
  let data = getData();
  if (data.users.some(user => user.userId === userId) === false) {
    return {error: 'Not A Valid User'};
  } 
  const arrayIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if(arrayIndex === -1) {
    return {error: 'Not A Valid Quiz'};
  } 
  if(data.quizzes[arrayIndex].userId !== userId) {
    return {error: 'Quiz Id not owned by this userId'};
  }
  data.quizzes.splice(arrayIndex, 1);
  return {  };
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
function adminQuizInfo ( userId, quizId ) {
  let data = getData();
  if (data.users.some(user => user.userId === userId) === false) {
    return {error: 'Not A Valid User'};
  } 
  /**assume quizId is one of the element name for data.quizzes*/
  let quiz = data.quizzes.find(q => q.quizId === quizId);
  if (quiz === undefined) {
    return {error: 'Not A Valid Quiz'};
  } 
  if(quiz.userId !== userId) {
    return {error: 'Quiz Id not owned by this userId'};
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
function adminQuizNameUpdate( userId, quizId, name ) {
  return {   };
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
function adminQuizDescriptionUpdate( userId, quizId, description ) {
  return {   };
}