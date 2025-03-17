/** 
 * This function provides a list of all the quizzes owned by the currently logged in user
 * 
 * @param { number } userId - The userId of the currently logged in user
 * 
 * @returns { Object } - Empty object
 */
export function adminQuizList( userId ) {
  let data = getData();

  let userExists = data.users.some(user => user.userId === userId);

  if (!userExists) {
    return { error: 'userId is not a valid user.' };
  }
  
  let userQuizzes = data.quizzes.filter(quiz => quiz.ownerId === userId);
  return { quizzes: userQuizzes.map(({ quizId, name }) => ({ quizId, name })) };

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

  let data = getData();
 
  let userExists = data.users.some(user => user.userId === userId);
  if (!userExists) {
    return { error: 'userId is not a valid user.' };
  }
  
  const userRegex = /^[a-zA-Z-' ]+$/;

  if (!(userRegex.test(name))) {
    return { error: 'Name contains invalid characters'}; 
  }
  else if (name.length < 3) {
    return { error: 'Name is too short'}
  }
  else if (name.length > 30) {
    return { error: 'Name is too long'}
  }
  
  let userQuizzes = data.quizzes.filter(quiz => quiz.creatorId === userId);
  if (userQuizzes.some(quiz => quiz.name === name)) {
    return { error: 'Name is already used by the same user' };
  }

  if (description.length > 100) {
    return { error: 'Description is too long' };
  }

  const quizId = data.quizzes.length + 1;
  const timestamp = Math.floor(Date.now() / 1000);
  const newQuiz = {
    quizId,
    creatorId: userId,
    name,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    description
  };

  data.quizzes.push(newQuiz);

  return {quizId};
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
 * @property { number } quizId - The quizId of the quix
 * @property { string } name - The name of the quiz
 * @property { number } timeCreated - The time that the quiz was created
 * @property { number } timeLastEdited - The time the quiz was last editted
 * @property { string } description - The description of the quiz
 */
function adminQuizInfo ( userId, quizId ) {
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',
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
export function adminQuizDescriptionUpdate( userId, quizId, description ) {
  let data = getData();
 
  let userExists = data.users.some(user => user.userId === userId);
  if (!userExists) {
    return { error: 'userId is not a valid user.' };
  }
  
  let quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz.' };
  }
  
  if (quiz.creatorId !== userId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.' };
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length.' };
  }
  
  let quizIndex = data.quizzes.findIndex(q => q.quizId === quizId);
  data.quizzes[quizIndex].description = description;
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  setData(data);
  
  return {   };
}