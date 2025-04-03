import {
    adminQuizInfo,
    adminQuizCreate,
    adminAuthRegister,
    adminQuestionCreate,
    clear
  } from '../requests'
  
  const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];
  // TO DO : check if colour checking correct
  describe('tests for adminQuizInfo', () => {
    let sessionToken: string;
    let quizId: number;
  
    beforeEach(() => {
      clear()
      const registerResult = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo')
      sessionToken = registerResult.session
      const quizResult = adminQuizCreate(sessionToken, 'test quiz', 'This quiz is for testing adminQuizInfo function')
      quizId = quizResult.quizId
    })
  
    describe('Error cases', () => {
      test('invalid session', () => {
        const res = adminQuizInfo('invalid-session', quizId)
        expect(res).toStrictEqual(401)
      })
  
      test('empty session', () => {
        const res = adminQuizInfo('', quizId)
        expect(res).toStrictEqual(401)
      })
  
      test('quiz does not exist', () => {
        const res = adminQuizInfo(sessionToken, quizId + 100)
        expect(res).toStrictEqual(403)
      })
  
      test('quiz ID not owned By input user', () => {
        const newRegisterResult = adminAuthRegister('Haoyuuuzz@gmail.com', 'thisisagoodpassword2025','Haoyu', 'Zhuang')
        const newSession = newRegisterResult.session
        const anotherQuizResult = adminQuizCreate(newSession, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input user')
        const anotherQuizId = anotherQuizResult.quizId
        const res = adminQuizInfo(sessionToken, anotherQuizId)
        expect(res).toStrictEqual(403)
      })
    })
  
    describe('Success cases', () => {
      test('Successfully updated the info of a quiz after a question is created', () => {
        const initialQuizInfo = adminQuizInfo(sessionToken, quizId)
        expect(initialQuizInfo).toStrictEqual({
          quizId: quizId,
          name: 'test quiz',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'This quiz is for testing adminQuizInfo function',
          numQuestions: 0,
          questions: [],
          timeLimit: 0
        })
        
        const questionBody = {
          question: "What is the capital of France?",
          timeLimit: 10,
          points: 5,
          answerOptions: [
            { answer: "Paris", correct: true },
            { answer: "London", correct: false },
            { answer: "Berlin", correct: false }
          ]
        }
        
        const questionResult = adminQuestionCreate(sessionToken, quizId, questionBody)
        const questionId = questionResult.questionId
        
       // Check updated quiz info
        const updatedQuizInfo = adminQuizInfo(sessionToken, quizId)
        expect(updatedQuizInfo).toStrictEqual({
          quizId: quizId,
          name: 'test quiz',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'This quiz is for testing adminQuizInfo function',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: "What is the capital of France?",
              duration: 10,
              points: 5,
              answers: expect.arrayContaining([
                expect.objectContaining({
                  answerId: expect.any(Number),
                  answer: "Paris",
                  colour: expect.any(String),
                  correct: true
                }),
                expect.objectContaining({
                  answerId: expect.any(Number),
                  answer: "London",
                  colour: expect.any(String),
                  correct: false
                }),
                expect.objectContaining({
                  answerId: expect.any(Number),
                  answer: "Berlin",
                  colour: expect.any(String),
                  correct: false
                })
              ])
            }
          ],
          duration: 10
        })
  
        // Check that all answer colours are valid
        updatedQuizInfo.questions.forEach((question: any) => {
          question.answers.forEach((answer: any) => {
            expect(colours).toContain(answer.colour)
          })
        })
        expect(updatedQuizInfo.timeLastEdited).toBeGreaterThanOrEqual(initialQuizInfo.timeLastEdited)
      })
    })
  })