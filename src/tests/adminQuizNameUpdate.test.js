import {
  clear,
} from '../other';

import {
  adminAuthRegister,
} from '../auth';

import {
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
} from '../quiz';

let userId;
let quizId;

describe('tests for adminQuizNameUpdate', () => {
  beforeEach(() => {
    clear();
    userId = adminAuthRegister(
      'hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith'
    ).userId;
    quizId = adminQuizCreate(userId, 'Quiz Name', 'This is a quiz description').quizId;
  });

  describe('success cases', () => {
    test('successfully updates quiz name', () => {
      const originalTime = adminQuizInfo(userId, quizId).timeLastEdited;

      expect(adminQuizNameUpdate(userId, quizId, 'Updated Quiz Name')).toStrictEqual(
        {}
      );

      expect(adminQuizInfo(userId, quizId).name).toStrictEqual('Updated Quiz Name');
      expect(adminQuizInfo(userId, quizId).timeLastEdited).toBeGreaterThanOrEqual(originalTime);
    });

    test('accepts name with numbers and spaces', () => {
      expect(adminQuizNameUpdate(userId, quizId, 'Quiz 123 With Spaces')).toStrictEqual(
        {}
      );

      expect(adminQuizInfo(userId, quizId).name).toStrictEqual('Quiz 123 With Spaces');
    });

    test('same name can be used by different users', () => {
      const user2Id = adminAuthRegister(
        'jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe'
      ).userId;
      const quiz2Id = adminQuizCreate(user2Id, 'Unique Name', 'Description').quizId;

      expect(adminQuizNameUpdate(user2Id, quiz2Id, 'Quiz Name')).toStrictEqual(
        {}
      );

      expect(adminQuizInfo(userId, quizId).name).toStrictEqual(
        adminQuizInfo(user2Id, quiz2Id).name
      );
    });
  });

  describe('error_msg cases', () => {
    test('error_msg when userId is invalid', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;
      const invalidUserId = userId + 'invalid';

      expect(adminQuizNameUpdate(invalidUserId, quizId, 'New Name')).toStrictEqual({
        error_msg: expect.any(String)
      });

      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when quizId is invalid', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;
      const invalidQuizId = quizId + 'invalid';

      expect(adminQuizNameUpdate(userId, invalidQuizId, 'New Name')).toStrictEqual(
        { error_msg: expect.any(String) }
      );

      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when quiz is not owned by user', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;
      const user2Result = adminAuthRegister('jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe');
      const user2Id = user2Result.userId;

      expect(adminQuizNameUpdate(user2Id, quizId, 'New Name')).toStrictEqual(
        { error_msg: expect.any(String) }
      );

      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when new name contains invalid characters', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;

      expect(adminQuizNameUpdate(userId, quizId, 'Invalid@Name!')).toStrictEqual(
        { error_msg: expect.any(String) }
      );
      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when new name is less than 3 characters', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;
      expect(adminQuizNameUpdate(userId, quizId, 'AB')).toStrictEqual(
        { error_msg: expect.any(String) }
      );

      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when new name is more than 30 characters', () => {
      const originalInfo = adminQuizInfo(userId, quizId);
      const originalName = originalInfo.name;
      const longName = 'This name is way too long for a quiz name and exceeds thirty characters';

      expect(adminQuizNameUpdate(userId, quizId, longName)).toStrictEqual(
        { error_msg: expect.any(String) }
      );

      const updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });

    test('error_msg when name is already used by same user', () => {
      const quiz2Result = adminQuizCreate(userId, 'Another Quiz', 'Another description');
      const quiz2Id = quiz2Result.quizId;
      const originalInfo = adminQuizInfo(userId, quiz2Id);
      const originalName = originalInfo.name;

      expect(adminQuizNameUpdate(userId, quiz2Id, 'Quiz Name')).toStrictEqual(
        { error_msg: expect.any(String) }
      );

      const updatedInfo = adminQuizInfo(userId, quiz2Id);
      expect(updatedInfo.name).toStrictEqual(originalName);
    });
  });
});
