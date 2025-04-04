import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuizTransfer,
  adminQuizInfo,
  adminQuizDelete,
  clear
} from '../requests';

describe('tests for adminQuizTransfer', () => {
  let sessionToken: string;
  let quizId: number;

  let sessionToken2: string;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'user@example.com', 'password123', 'John', 'Doe'
    ) as { session: string };
    sessionToken = registerResult.session;

    const createQuizResult = adminQuizCreate(
      sessionToken, 'Sample Quiz', 'A description of my quiz'
    ) as { quizId: number };
    quizId = createQuizResult.quizId;

    const registerResult2 = adminAuthRegister(
      'yuchao@unsw.edu.au', 'goodpassword123', 'Yu', 'Chao'
    ) as { session: string };
    sessionToken2 = registerResult2.session;
  });

  describe('Success cases', () => {
    test('Successfully transfers quiz ownership to another user', () => {
      const res = adminQuizTransfer(sessionToken, quizId, 'yuchao@unsw.edu.au');
      expect(res).toStrictEqual({});

      expect(adminQuizInfo(sessionToken, quizId)).toStrictEqual(403);

      expect(adminQuizInfo(sessionToken2, quizId)).toStrictEqual({
        quizId: quizId,
        name: 'Sample Quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'A description of my quiz',
        numQuestions: 0,
        questions: [],
        timeLimit: 0
      });
    });
  });

  describe('Error cases', () => {
    test('Error when session is empty', () => {
      const res = adminQuizTransfer('', quizId, 'yuchao@unsw.edu.au');
      expect(res).toStrictEqual(401);
    });

    test('Error when session is invalid', () => {
      const res = adminQuizTransfer('invalid-session-token', quizId, 'yuchao@unsw.edu.au');
      expect(res).toStrictEqual(401);
    });

    test('Error if userEmail is not a real user', () => {
      const res = adminQuizTransfer(sessionToken, quizId, 'nonexistent@domain.com');
      expect(res).toStrictEqual(400);
    });

    test('Error if userEmail is the current logged-in user', () => {
      const res = adminQuizTransfer(sessionToken, quizId, 'user@example.com');
      expect(res).toStrictEqual(400);
    });

    test('Error if quiz name is already used by target user', () => {
      adminQuizCreate(
        sessionToken2, 'Sample Quiz', 'A description of my quiz'
      ) as { quizId: number };

      // Attempt to transfer quiz again to the same user
      const res = adminQuizTransfer(sessionToken, quizId, 'yuchao@unsw.edu.au');
      expect(res).toStrictEqual(400);
    });

    test('Error if the user is not the quiz owner', () => {
      const createQuizResult2 = adminQuizCreate(
        sessionToken2, 'Another Quiz', 'A description of another quiz'
      ) as { quizId: number };
      const quizId2 = createQuizResult2.quizId;

      const res = adminQuizTransfer(sessionToken, quizId2, 'user@example.com');
      expect(res).toStrictEqual(403);
    });

    test('Error if the quiz does not exist', () => {
      // Remove the quiz, now quiz does not exist
      adminQuizDelete(sessionToken, quizId);

      const res = adminQuizTransfer(sessionToken, quizId, 'anotheruser@example.com');
      expect(res).toStrictEqual(403);
    });
  });
});
