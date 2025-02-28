/** 
 * 
 * @param {number} userId 
 * @returns {Object}
 * 
 * 
 * Given the userId 
 *  return a quiz object with quizId and name.
 */
function adminQuizList(userId) {
  return { 
    quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
  };
}




/**
 * 
 * @param {number} userId 
 * @param {String} name 
 * @param {String} description 
 * @returns {object}
 * 
 * 
 * This function takes in the userId , name and description
 * Returns a quizId 
 */

function adminQuizCreate( userId, name, description ) {
  return {
    quizId: 2
  }
}


/** 
 * <This function is used to permanently remove a particular quiz>
 * 
 * @param {number} userId - this parameter is user id
 * @param {number} quizId - this parameter is quiz id
 * 
 * @returns {object} - this function returns an empty object
 */

function adminQuizRemove(userId, quizId) {
    return {};
}




/**
 * <This function gets all of the relevant information about current quiz>
 * 
 * @param {number} userId - user ID
 * @param {number} quizId - quiz ID
 * 
 * @returns {object} - this function returns an object containing all
 * information properties about current quiz.
 * Example values are added to each property of the return object.
 */

function adminQuizInfo (userId, quizId) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',

    }
}