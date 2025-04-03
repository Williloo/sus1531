import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizDescriptionUpdate
} from '../requests';

describe('tests for adminQuizDescriptionUpdate', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith'
    );
    sessionToken = registerResult.session;

    const quizResult = adminQuizCreate(sessionToken, 'Test Quiz', 'Original description');
    quizId = quizResult.quizId;
  });

  describe('Success cases', () => {
    test('quiz description updated to a new description', () => {
      const newDescription = 'This is the updated description';
      const res = adminQuizDescriptionUpdate(sessionToken, quizId, newDescription);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.description).toStrictEqual(newDescription);
    });

    test('empty description is allowed', () => {
      const res = adminQuizDescriptionUpdate(sessionToken, quizId, '');
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.description).toStrictEqual('');
    });
  });

  describe('Error cases', () => {
    test('error when session is invalid', () => {
      const res = adminQuizDescriptionUpdate('invalid-session', quizId, 'New description');
      expect(res).toStrictEqual(401);
    });

    test('error when session is empty', () => {
      const res = adminQuizDescriptionUpdate('', quizId, 'New description');
      expect(res).toStrictEqual(401);
    });

    test('error when quiz is not owned by user', () => {
      const newUserResult = adminAuthRegister(
        'another.user@unsw.edu.au', 'anotherPassword1', 'Another', 'User'
      );
      const newSessionToken = newUserResult.session;

      // Attempt to update first user's quiz with second user's session
      const res = adminQuizDescriptionUpdate(newSessionToken, quizId, 'Unauthorized update');
      expect(res).toStrictEqual(403);

      // Verify the description was not changed
      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.description).toStrictEqual('Original description');
    });

    test('quiz does not exist', () => {
      const nonExistentQuizId = quizId + 1000;
      const res = adminQuizDescriptionUpdate(sessionToken, nonExistentQuizId, 'New description');
      expect(res).toStrictEqual(403);
    });

    test('new description longer than 100 characters should return an error', () => {
      const longDescription = 'A'.repeat(101);
      const res = adminQuizDescriptionUpdate(sessionToken, quizId, longDescription);
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.description).toStrictEqual('Original description');
    });

    test('update description of a quiz that is not owned by an user will return error', () => {
      const otherUserResult = adminAuthRegister(
        'other.user@unsw.edu.au', 'password123', 'Other', 'User'
      );
      const otherSessionToken = otherUserResult.session;

      const otherQuizResult = adminQuizCreate(
        otherSessionToken, 'Other Quiz', 'Other description'
      );
      const otherQuizId = otherQuizResult.quizId;

      // First user tries to update second user's quiz
      const res = adminQuizDescriptionUpdate(sessionToken, otherQuizId, 'Unauthorized update');
      expect(res).toStrictEqual(403);

      // Verify the description was not changed
      const quizInfo = adminQuizInfo(otherSessionToken, otherQuizId);
      expect(quizInfo.description).toStrictEqual('Other description');
    });
  });
});
