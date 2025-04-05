import {
  // adminAuthRegister,
  // adminAuthLogin,
  // adminUserDetails,
  // adminQuizCreate,
  // adminQuizList,
  // adminQuizInfo,
  clear
} from '../requests';

describe('DELETE /v1/clear', () => {
  test('Clearing returns an empty object', () => {
    expect(clear()).toStrictEqual({});
  });

  // test('Clear removes registered users', () => {
  //   const registerResult = adminAuthRegister(
  //     'user@example.com', 'password123', 'John', 'Doe'
  //   ) as { session: string };
  //   const sessionToken = registerResult.session;

  //   expect(adminUserDetails(sessionToken)).not.toStrictEqual(401);

  //   clear();

  //   expect(adminUserDetails(sessionToken)).toStrictEqual(401);

  //   expect(adminAuthLogin('user@example.com', 'password123')).toStrictEqual(400);
  // });

  // test('Clear removes created quizzes', () => {
  //   const registerResult = adminAuthRegister(
  //     'user@example.com', 'password123', 'John', 'Doe'
  //   ) as { session: string };
  //   const sessionToken = registerResult.session;

  //   const quizResult = adminQuizCreate(
  //     sessionToken, 'Test Quiz', 'Description'
  //   ) as { quizId: number };
  //   const quizId = quizResult.quizId;

  //   expect(adminQuizInfo(sessionToken, quizId)).not.toStrictEqual(403);

  //   clear();

  //   const newRegisterResult = adminAuthRegister(
  //     'newuser@example.com', 'password123', 'New', 'User'
  //   ) as { session: string };
  //   const newSessionToken = newRegisterResult.session;

  //   expect(adminQuizInfo(newSessionToken, quizId)).toStrictEqual(403);

  //   expect(adminQuizList(newSessionToken)).toStrictEqual({ quizzes: [] });
  // });

  // test('Clear removes created questions', () => {
  //   const registerResult = adminAuthRegister(
  //     'user@example.com', 'password123', 'John', 'Doe'
  //   ) as { session: string };
  //   const sessionToken = registerResult.session;

  //   const quizResult = adminQuizCreate(
  //     sessionToken, 'Test Quiz', 'Description'
  //   ) as { quizId: number };
  //   const quizId = quizResult.quizId;

  //   const questionBody = {
  //     question: 'Test Question?',
  //     timeLimit: 10,
  //     points: 5,
  //     answerOptions: [
  //       { answer: 'Yes', correct: true },
  //       { answer: 'No', correct: false }
  //     ]
  //   };

  //   adminQuizQuestionCreate(
  //     sessionToken, quizId,
  //     questionBody.question, questionBody.timeLimit,
  //     questionBody.points, questionBody.answerOptions
  //   );

  //   const quizInfo = adminQuizInfo(sessionToken, quizId) as any;
  //   expect(quizInfo.questions.length).toBeGreaterThan(0);

  //   clear();

  //   const newRegisterResult = adminAuthRegister(
  //     'newuser@example.com', 'password123', 'New', 'User'
  //   ) as { session: string };
  //   const newSessionToken = newRegisterResult.session;

  //   const newQuizResult = adminQuizCreate(
  //     newSessionToken, 'New Quiz', 'Description'
  //   ) as { quizId: number };
  //   const newQuizId = newQuizResult.quizId;

  //   const newQuizInfo = adminQuizInfo(newSessionToken, newQuizId) as any;
  //   expect(newQuizInfo.questions.length).toBe(0);
  // });
});
