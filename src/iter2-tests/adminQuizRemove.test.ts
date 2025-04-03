import {
    adminQuizRemove,
    adminQuizCreate,
    adminAuthRegister,
    adminQuizList,
    clear,
  } from '../requests'
  
  describe('tests for adminQuizRemove', () => {
    let sessionToken: string;
    let quizId: number;
    
    beforeEach(() => {
      clear()
      const registerResult = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo')
      sessionToken = registerResult.session
      const quizResult = adminQuizCreate(sessionToken, 'test quiz', 'This quiz is for testing adminQuizRemove function')
      quizId = quizResult.quizId
    })
    
    describe('Success cases', () => {
      //TO DO
      const res = adminQuizRemove(sessionToken, quizId)
      expect(res).toStrictEqual({})
      expect(adminQuizList(sessionToken)).toStrictEqual({
        "quizzes": []
      })
      
    })
    
    //TO DO using QuizList to check that quiz not removed
    describe('Error cases', () => {
      test('invalid session', () => {
        const res = adminQuizRemove('invalid-session-token', quizId)
        expect(res).toStrictEqual(401)
      })
      
      test('empty session', () => {
        const res = adminQuizRemove('', quizId)
        expect(res).toStrictEqual(401)
      })
      
      test('Valid session is provided, but the quiz does not exist', () => {
        const res = adminQuizRemove(sessionToken, quizId + 100)
        expect(res).toStrictEqual(403)
      })

      test('Valid session is provided, but quiz ID Not Owned By Input User', () => {
        const newRegisterResult = adminAuthRegister('Haoyuuuzz@gmail.com', 'thisisagoodpassword2025', 'Haoyu', 'Zhuang')
        const newSession = newRegisterResult.session
        const anotherQuizResult = adminQuizCreate(newSession, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input user')
        const anotherQuizId = anotherQuizResult.quizId
        
        const res = adminQuizRemove(sessionToken, anotherQuizId)
        expect(res).toStrictEqual(403)

      })
    })
  })