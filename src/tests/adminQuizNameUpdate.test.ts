import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
} from '../requests';

describe('tests for adminQuizNameUpdate', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    sessionToken = adminAuthRegister(
      'hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith'
    ).session;
    quizId = adminQuizCreate(sessionToken, 'Quiz Name', 'This is a quiz description').quizId;
  });

  describe('Success cases', () => {
    test('successfully updates quiz name', () => {
      const newName = 'Updated Quiz Name';
      const res = adminQuizNameUpdate(sessionToken, quizId, newName);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual(newName);
    });

    test('accepts name with numbers and spaces', () => {
      const newName = 'Quiz 123 With Spaces';
      const res = adminQuizNameUpdate(sessionToken, quizId, newName);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual(newName);
    });

    test('same name can be used by different users', () => {
      const otherUserResult = adminAuthRegister(
        'other.user@unsw.edu.au', 'password123', 'Other', 'User'
      );
      const otherSessionToken = otherUserResult.session;

      const otherQuizId = adminQuizCreate(
        otherSessionToken, 'Other Quiz', 'Other description'
      ).quizId;
      const res = adminQuizNameUpdate(otherSessionToken, otherQuizId, 'Quiz Name');
      expect(res).toStrictEqual({});

      // Verify both quizzes have the same name
      const quizInfo1 = adminQuizInfo(sessionToken, quizId);
      const quizInfo2 = adminQuizInfo(otherSessionToken, otherQuizId);
      expect(quizInfo1.name).toStrictEqual('Quiz Name');
      expect(quizInfo2.name).toStrictEqual('Quiz Name');
    });
  });

  describe('Error cases', () => {
    test('error when session is invalid', () => {
      const res = adminQuizNameUpdate('invalid-session', quizId, 'New Quiz Name');
      expect(res).toStrictEqual(401);
    });

    test('error when session is empty', () => {
      const res = adminQuizNameUpdate('', quizId, 'New Quiz Name');
      expect(res).toStrictEqual(401);
    });

    test('error when quiz is not owned by user', () => {
      const newUserResult = adminAuthRegister(
        'another.user@unsw.edu.au', 'anotherPassword1', 'Another', 'User'
      );
      const newSessionToken = newUserResult.session;

      // Attempt to update first user's quiz with second user's session
      const res = adminQuizNameUpdate(newSessionToken, quizId, 'Unauthorized update');
      expect(res).toStrictEqual(403);

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('quiz does not exist', () => {
      const nonExistentQuizId = quizId + 1000;
      const res = adminQuizNameUpdate(sessionToken, nonExistentQuizId, 'New Quiz Name');
      expect(res).toStrictEqual(403);
    });

    test('error when new name contains invalid characters', () => {
      const res = adminQuizNameUpdate(sessionToken, quizId, 'Invalid@Name#');
      expect(res).toStrictEqual(403);
      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when new name is less than 3 characters', () => {
      const res = adminQuizNameUpdate(sessionToken, quizId, 'AB');
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when new name is more than 30 characters', () => {
      const longName = 'This quiz name is way too long and exceeds' +
      'the maximum length of thirty characters';
      const res = adminQuizNameUpdate(sessionToken, quizId, longName);
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId);
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when name is already used by the current logged in user for another quiz', () => {
      const secondQuizId = adminQuizCreate(
        sessionToken, 'Second Quiz', 'Another quiz description'
      ).quizId;
      const res = adminQuizNameUpdate(sessionToken, secondQuizId, 'Quiz Name');
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, secondQuizId);
      expect(quizInfo.name).toStrictEqual('Second Quiz');
    });
  });
});
