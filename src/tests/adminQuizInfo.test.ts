import {
  adminQuizInfo,
  adminQuizCreate,
  adminAuthRegister,
  adminQuestionCreate,
  clear
} from '../requests';

const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

// TO DO : check if colour checking correct, timestamps + timelimit
describe('tests for adminQuizInfo', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    );
    sessionToken = registerResult.session;

    const quizResult = adminQuizCreate(
      sessionToken, 'test quiz', 'This quiz is for testing adminQuizInfo function'
    );
    quizId = quizResult.quizId;
  });

  describe('Error cases', () => {
    test('invalid session', () => {
      const res = adminQuizInfo('invalid-session', quizId);
      expect(res).toStrictEqual(401);
    });

    test('empty session', () => {
      const res = adminQuizInfo('', quizId);
      expect(res).toStrictEqual(401);
    });

    test('quiz does not exist', () => {
      const res = adminQuizInfo(sessionToken, quizId + 100);
      expect(res).toStrictEqual(403);
    });

    test('quiz ID not owned By input user', () => {
      const newRegisterResult = adminAuthRegister(
        'Haoyuuuzz@gmail.com', 'thisisagoodpassword2025', 'Haoyu', 'Zhuang'
      );
      const newSession = newRegisterResult.session;

      const anotherQuizResult = adminQuizCreate(
        newSession, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input user'
      );
      const anotherQuizId = anotherQuizResult.quizId;
      const res = adminQuizInfo(sessionToken, anotherQuizId);
      expect(res).toStrictEqual(403);
    });
  });

  describe('Success cases', () => {
    test('successfully display info of an empty quiz with no questions', () => {
      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo).toStrictEqual(
       {
         quizId: quizId,
         name: 'test quiz',
         timeCreated: expect.any(Number),
         timeLastEdited: expect.any(Number),
         description: 'This quiz is for testing adminQuizInfo function',
       }
      );
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(quizInfo.timeLastEdited);
    }); 

    test('Successfully displayed quizInfo when questions are added', () => {
      const requestTime = Date.now();

      const initialQuizInfo = adminQuizInfo(sessionToken, quizId);

      const questionBody1 = {
        question: 'What is the capital of France?',
        timeLimit: 10,
        points: 5,
        answerOptions: [
          { answer: 'Paris', correct: true },
          { answer: 'London', correct: false },
          { answer: 'Berlin', correct: false }
        ]
      };

      const questionResult = adminQuestionCreate(sessionToken, quizId, questionBody1);
      const questionId1 = questionResult.questionId;

      const questionBody2 = {
        question: 'What is the capital of Australia?',
        timeLimit: 10,
        points: 5,
        answerOptions: [
          { answer: 'Canbera', correct: true },
          { answer: 'Sydney', correct: false },
          { answer: 'Brisbane', correct: false }
        ]
      };

      const questionResult2 = adminQuestionCreate(sessionToken, quizId, questionBody2);
      const questionId2 = questionResult.questionId;

      // Check updated quiz info
      const updatedQuizInfo = adminQuizInfo(sessionToken, quizId);
      expect(updatedQuizInfo).toStrictEqual({
        quizId: quizId,
        name: 'test quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This quiz is for testing adminQuizInfo function',
        numQuestions: 1,
        questions: [
          {
            questionId: questionId1,
            question: 'What is the capital of France?',
            timeLimit: 10,
            points: 5,
            answers: expect.arrayContaining([
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'Paris',
                colour: expect.any(String),
                correct: true
              }),
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'London',
                colour: expect.any(String),
                correct: false
              }),
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'Berlin',
                colour: expect.any(String),
                correct: false
              })
            ])
          },
          {
            questionId: questionId2,
            question: 'What is the capital of Australia?',
            timeLimit: 10,
            points: 5,
            answers: expect.arrayContaining([
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'Canberra',
                colour: expect.any(String),
                correct: true
              }),
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'Sydney',
                colour: expect.any(String),
                correct: false
              }),
              expect.objectContaining({
                answerId: expect.any(Number),
                answer: 'Brisbane',
                colour: expect.any(String),
                correct: false
              })
            ])
          }
        ],
        timeimit: 20
      });

      // Check that all answer colours are valid
      updatedQuizInfo.questions.forEach((question: any) => {
        question.answers.forEach((answer: any) => {
          expect(colours).toContain(answer.colour);
        });
      });

      expect(
        updatedQuizInfo.timeLastEdited
      ).toBeGreaterThanOrEqual(initialQuizInfo.timeLastEdited);

      //Check if the delay between request time and when the server processes it is no more than 1 sec
      expect(updatedQuizInfo.timeLastEdited).toBeLessThanOrEqual(requestTime + 1000);
    });
  });
});
