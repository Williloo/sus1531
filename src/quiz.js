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