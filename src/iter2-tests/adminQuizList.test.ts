import {
    adminQuizList,
    adminQuizCreate,
    adminAuthRegister,
    clear
  } from '../requests'
  
  describe('tests for adminQuizList', () => {
    let sessionToken: string
    
    beforeEach(() => {
      clear()
      const registerResult = adminAuthRegister('validemail@gmail.com', 'Password123', 'Yash', 'Mittal')
      sessionToken = registerResult.session
    })
    
    describe('Error tests', () => {
      test('invalid session', () => {
        const res = adminQuizList('invalid-session')
        expect(res).toStrictEqual(401)
      })
      
      test('empty session', () => {
        const res = adminQuizList('')
        expect(res).toStrictEqual(401)
      })
    })
    
    describe('Success tests', () => {
      test('valid user with no quizzes', () => {
        const res = adminQuizList(sessionToken)
        expect(res).toStrictEqual({ quizzes: [] })
      })
      
      test('valid user with quizzes', () => {
        adminQuizCreate(sessionToken, 'Quiz 1', '')
        adminQuizCreate(sessionToken, 'Quiz 2', '')
        
        const res = adminQuizList(sessionToken)
        expect(res).toStrictEqual({
          quizzes: [
            { quizId: expect.any(Number), name: 'Quiz 1' },
            { quizId: expect.any(Number), name: 'Quiz 2' }
          ]
        })
      })
    })
  })