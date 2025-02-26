/*
 * 
 * @param {Integer} userId 
 * @returns {Object}
 */

/*
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
    }
}