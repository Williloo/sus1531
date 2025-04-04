import {
  adminQuizInfo,
  adminQuizCreate,
  adminAuthRegister,
  adminQuestionCreate,
  clear
} from '../requests';

import {
  QuizDetails
} from '../interface';

const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

describe('tests for adminQuizInfo', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    ) as { sessionId: string };
    sessionToken = registerResult.sessionId;

    const quizResult = adminQuizCreate(
      sessionToken, 'test quiz', 'This quiz is for testing adminQuizInfo function'
    ) as { quizId: number };
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
      ) as { sessionId: string };
      const newSession = newRegisterResult.sessionId;

      const anotherQuizResult = adminQuizCreate(
        newSession, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input user'
      ) as { quizId: number };
      const anotherQuizId = anotherQuizResult.quizId;

      const res = adminQuizInfo(sessionToken, anotherQuizId);
      expect(res).toStrictEqual(403);
    });
  });

  describe('Success cases', () => {
    test('successfully display info of an empty quiz with no questions', () => {
      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo).toStrictEqual({
        quizId: quizId,
        name: 'test quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This quiz is for testing adminQuizInfo function',
        numQuestions: 0,
        questions: [],
        timeimit: 0
      });
      expect(
        (quizInfo as QuizDetails).timeLastEdited
      ).toBeGreaterThanOrEqual((quizInfo as QuizDetails).timeLastEdited);
    });

    test('Successfully displayed quizInfo when questions are added', () => {
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

      const questionResult = adminQuestionCreate(
        sessionToken, quizId,
        questionBody1.question, questionBody1.timeLimit,
        questionBody1.points, questionBody1.answerOptions
      ) as { questionId: number };
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

      const questionResult2 = adminQuestionCreate(
        sessionToken, quizId,
        questionBody2.question, questionBody2.timeLimit,
        questionBody2.points, questionBody2.answerOptions
      ) as { questionId: number };
      const questionId2 = questionResult2.questionId;

      // Check updated quiz info
      const requestTime = Date.now();
      const updatedQuizInfo = adminQuizInfo(sessionToken, quizId);
      expect(updatedQuizInfo).toStrictEqual({
        quizId: quizId,
        name: 'test quiz',
        timeCreated: (initialQuizInfo as QuizDetails),
        timeLastEdited: expect.any(Number),
        description: 'This quiz is for testing adminQuizInfo function',
        numQuestions: 2,
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
      (updatedQuizInfo as QuizDetails).questions.forEach((question: any) => {
        question.answers.forEach((answer: any) => {
          expect(colours).toContain(answer.colour);
        });
      });

      expect(
        (updatedQuizInfo as QuizDetails).timeLastEdited
      ).toBeGreaterThanOrEqual((initialQuizInfo as QuizDetails).timeLastEdited);

      // Check if the delay between request time and when the quiz creation it is less than 1 sec
      expect(
        Math.abs(requestTime - (updatedQuizInfo as QuizDetails).timeLastEdited)
      ).toBeLessThan(1000);
    });
  });
});
