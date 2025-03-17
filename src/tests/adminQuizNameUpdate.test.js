import {
  clear
} from '../other';

import {
  adminAuthRegister,
  adminUserDetails
} from '../auth';

import {
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizList
} from '../quiz';

let userId;
let quizId;

beforeEach(() => {
  clear();
  let result = adminAuthRegister('hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith');
  userId = result.userId;
  let quizResult = adminQuizCreate(userId, 'Quiz Name', 'This is a quiz description');
  quizId = quizResult.quizId;
});

describe('adminQuizNameUpdate', () => {
  describe('Success cases', () => {
    test('successfully updates quiz name', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalTime = originalInfo.timeLastEdited;
      let newName = 'Updated Quiz Name';
      let updateResult = adminQuizNameUpdate(userId, quizId, newName);
      expect(updateResult).toStrictEqual({ });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(newName);
      expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(originalTime);
    });
    
    test('accepts name with numbers and spaces', () => {
      let newName = 'Quiz 123 With Spaces';
      let updateResult = adminQuizNameUpdate(userId, quizId, newName);
      expect(updateResult).toStrictEqual({ });
      let quizInfo = adminQuizInfo(userId, quizId);
      expect(quizInfo.name).toBe(newName);
    });
    
    test('same name can be used by different users', () => {
      let user2Result = adminAuthRegister('jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe');
      let user2Id = user2Result.userId;
      let quiz2Result = adminQuizCreate(user2Id, 'Unique Name', 'Description');
      let updateResult = adminQuizNameUpdate(user2Id, quiz2Result.quizId, 'Quiz Name');
      expect(updateResult).toStrictEqual({ });
      let quiz1Info = adminQuizInfo(userId, quizId);
      let quiz2Info = adminQuizInfo(user2Id, quiz2Result.quizId);
      expect(quiz1Info.name).toBe(quiz2Info.name);
    });
  });

  describe('Error cases', () => {
    test('error when userId is invalid', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      let invalidUserId = userId + 'invalid';
      expect(adminQuizNameUpdate(invalidUserId, quizId, 'New Name')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when quizId is invalid', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      let invalidQuizId = quizId + 'invalid';
      expect(adminQuizNameUpdate(userId, invalidQuizId, 'New Name')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when quiz is not owned by user', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      let user2Result = adminAuthRegister('jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe');
      let user2Id = user2Result.userId;
      expect(adminQuizNameUpdate(user2Id, quizId, 'New Name')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when new name contains invalid characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      expect(adminQuizNameUpdate(userId, quizId, 'Invalid@Name!')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when new name is less than 3 characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      expect(adminQuizNameUpdate(userId, quizId, 'AB')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when new name is more than 30 characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId);
      let originalName = originalInfo.name;
      let longName = 'This name is way too long for a quiz name and exceeds thirty characters';
      expect(adminQuizNameUpdate(userId, quizId, longName)).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quizId);
      expect(updatedInfo.name).toBe(originalName);
    });
    
    test('error when name is already used by same user', () => {
      let quiz2Result = adminQuizCreate(userId, 'Another Quiz', 'Another description');
      let quiz2Id = quiz2Result.quizId;
      let originalInfo = adminQuizInfo(userId, quiz2Id);
      let originalName = originalInfo.name;
      expect(adminQuizNameUpdate(userId, quiz2Id, 'Quiz Name')).toStrictEqual({
        error: expect.any(String)
      });
      let updatedInfo = adminQuizInfo(userId, quiz2Id);
      expect(updatedInfo.name).toBe(originalName);
    });
  });
});