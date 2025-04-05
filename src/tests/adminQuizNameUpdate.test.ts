import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
} from '../requests';

import {
  QuizDetails
} from '../interface';

describe('tests for adminQuizNameUpdate', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith'
    ) as { session: string };
    sessionToken = registerResult.session;

    const quizResult = adminQuizCreate(
      sessionToken, 'Quiz Name', 'This is a quiz description'
    ) as { quizId: number };
    quizId = quizResult.quizId;
  });

  describe('Success cases', () => {
    test('successfully updates quiz name', () => {
      const newName = 'Updated Quiz Name';
      const res = adminQuizNameUpdate(sessionToken, quizId, newName);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual(newName);
    });

    test('accepts name with numbers and spaces', () => {
      const newName = 'Quiz 123 With Spaces';
      const res = adminQuizNameUpdate(sessionToken, quizId, newName);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual(newName);
    });

    test('same name can be used by different users', () => {
      const otherUserResult = adminAuthRegister(
        'other.user@unsw.edu.au', 'password123', 'Other', 'User'
      ) as { session: string };
      const otherSessionToken = otherUserResult.session;

      const otherQuizResult = adminQuizCreate(
        otherSessionToken, 'Other Quiz', 'Other description'
      ) as { quizId: number };
      const otherQuizId = otherQuizResult.quizId;

      const res = adminQuizNameUpdate(otherSessionToken, otherQuizId, 'Quiz Name');
      expect(res).toStrictEqual({});

      // Verify both quizzes have the same name
      const quizInfo1 = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      const quizInfo2 = adminQuizInfo(otherSessionToken, otherQuizId) as QuizDetails;

      expect(quizInfo1.name).toStrictEqual('Quiz Name');
      expect(quizInfo2.name).toStrictEqual('Quiz Name');
    });

    test('timeLastEdited is updated when name is changed', () => {
      const initialInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      const initialEditTime = initialInfo.timeLastEdited;

      const beforeRequestTime = Math.floor(Date.now() / 1000);

      adminQuizNameUpdate(sessionToken, quizId, 'New Name');

      const afterRequestTime = Math.floor(Date.now() / 1000);

      const updatedInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;

      expect(updatedInfo.timeLastEdited).toBeGreaterThan(initialEditTime);
      expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(beforeRequestTime);
      expect(updatedInfo.timeLastEdited).toBeLessThanOrEqual(afterRequestTime + 1);
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
      ) as { session: string };
      const newSessionToken = newUserResult.session;

      // Attempt to update first user's quiz with second user's session
      const res = adminQuizNameUpdate(newSessionToken, quizId, 'Unauthorized update');
      expect(res).toStrictEqual(403);

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('quiz does not exist', () => {
      const nonExistentQuizId = quizId + 1000;
      const res = adminQuizNameUpdate(sessionToken, nonExistentQuizId, 'New Quiz Name');
      expect(res).toStrictEqual(403);
    });

    test('error when new name contains invalid characters', () => {
      const res = adminQuizNameUpdate(sessionToken, quizId, 'Invalid@Name#');
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when new name is less than 3 characters', () => {
      const res = adminQuizNameUpdate(sessionToken, quizId, 'AB');
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when new name is more than 30 characters', () => {
      const longName = 'This quiz name is way too long and exceeds' +
      'the maximum length of thirty characters';
      const res = adminQuizNameUpdate(sessionToken, quizId, longName);
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual('Quiz Name');
    });

    test('error when name is already used by the current logged in user for another quiz', () => {
      const secondQuizResult = adminQuizCreate(
        sessionToken, 'Second Quiz', 'Another quiz description'
      ) as { quizId: number };
      const secondQuizId = secondQuizResult.quizId;

      const res = adminQuizNameUpdate(sessionToken, secondQuizId, 'Quiz Name');
      expect(res).toStrictEqual(400);

      const quizInfo = adminQuizInfo(sessionToken, secondQuizId) as QuizDetails;
      expect(quizInfo.name).toStrictEqual('Second Quiz');
    });
  });
});
