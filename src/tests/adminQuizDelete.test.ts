import {
  adminQuizDelete,
  adminQuizCreate,
  adminAuthRegister,
  adminQuizList,
  clear,
} from '../requests';

describe('tests for adminQuizDelete', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    ) as { session: string };
    sessionToken = registerResult.session;

    const quizResult = adminQuizCreate(
      sessionToken, 'test quiz', 'This quiz is for testing adminQuizDelete function'
    ) as { quizId: number };
    quizId = quizResult.quizId;
  });

  describe('Success cases', () => {
    test('success case', () => {
      const res = adminQuizDelete(sessionToken, quizId);

      expect(res).toStrictEqual({});

      expect(adminQuizList(sessionToken)).toStrictEqual({
        quizzes: []
      });
    });
  });

  describe('Error cases', () => {
    test('invalid session', () => {
      const res = adminQuizDelete('invalid-session-token', quizId);
      expect(res).toStrictEqual(401);

      const quizes = adminQuizList(sessionToken);
      expect(quizes).toStrictEqual({
        quizzes: [
          { quizId: quizId, name: 'test quiz' }
        ]
      });
    });

    test('empty session', () => {
      const res = adminQuizDelete('', quizId);
      expect(res).toStrictEqual(401);
    });

    test('Valid session is provided, but the quiz does not exist', () => {
      const res = adminQuizDelete(sessionToken, quizId + 100);
      expect(res).toStrictEqual(403);
      const quizes = adminQuizList(sessionToken);
      expect(quizes).toStrictEqual({
        quizzes: [
          { quizId: quizId, name: 'test quiz' }
        ]
      });
    });

    test('Valid session is provided, but quiz ID Not Owned By Input User', () => {
      const newRegisterResult = adminAuthRegister(
        'Haoyuuuzz@gmail.com', 'thisisagoodpassword2025', 'Haoyu', 'Zhuang'
      ) as { session: string };
      const newSession = newRegisterResult.session;

      const anotherQuizResult = adminQuizCreate(
        newSession, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input user'
      ) as { quizId: number };
      const anotherQuizId = anotherQuizResult.quizId;

      const res = adminQuizDelete(sessionToken, anotherQuizId);
      expect(res).toStrictEqual(403);
      const quizzes = adminQuizList(sessionToken);
      expect(quizzes).toStrictEqual({
        quizzes: [
          { quizId: quizId, name: 'test quiz' }
        ]
      });
    });
  });
});
