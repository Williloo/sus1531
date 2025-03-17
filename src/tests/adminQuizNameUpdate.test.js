import {
  clear,
} from '../other'

import {
  adminAuthRegister,
} from '../auth'

import {
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
} from '../quiz'

let userId
let quizId

describe('tests for adminQuizNameUpdate', () => {
  beforeEach(() => {
    clear()
    userId = adminAuthRegister('hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith').userId
    quizId = adminQuizCreate(userId, 'Quiz Name', 'This is a quiz description').quizId
  })

  describe('success cases', () => {
    test('successfully updates quiz name', () => {
      let originalTime = adminQuizInfo(userId, quizId).timeLastEdited

      expect(adminQuizNameUpdate(userId, quizId, 'Updated Quiz Name')).toStrictEqual(
        {  }
      )
      
      expect(adminQuizInfo(userId, quizId).name).toStrictEqual('Updated Quiz Name')
      expect(adminQuizInfo(userId, quizId).timeLastEdited).toBeGreaterThanOrEqual(originalTime)
    })
    
    test('accepts name with numbers and spaces', () => {      
      expect(adminQuizNameUpdate(userId, quizId, 'Quiz 123 With Spaces')).toStrictEqual(
        {  }
      )

      expect(adminQuizInfo(userId, quizId).name).toStrictEqual('Quiz 123 With Spaces')
    })
    
    test('same name can be used by different users', () => {
      let user2Id = adminAuthRegister('jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe').userId
      let quiz2Id = adminQuizCreate(user2Id, 'Unique Name', 'Description').quizId

      expect(adminQuizNameUpdate(user2Id, quiz2Id, 'Quiz Name')).toStrictEqual(
        { }
      )

      expect(adminQuizInfo(userId, quizId).name).toStrictEqual(adminQuizInfo(user2Id, quiz2Id).name)
    })
  })

  describe('error cases', () => {
    test('error when userId is invalid', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name
      let invalidUserId = userId + 'invalid'

      expect(adminQuizNameUpdate(invalidUserId, quizId, 'New Name')).toStrictEqual({
        error: expect.any(String)
      })

      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when quizId is invalid', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name
      let invalidQuizId = quizId + 'invalid'

      expect(adminQuizNameUpdate(userId, invalidQuizId, 'New Name')).toStrictEqual(
        { error: expect.any(String) }
      )

      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when quiz is not owned by user', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name
      let user2Result = adminAuthRegister('jane.doe@unsw.edu.au', 'password123', 'Jane', 'Doe')
      let user2Id = user2Result.userId

      expect(adminQuizNameUpdate(user2Id, quizId, 'New Name')).toStrictEqual(
        { error: expect.any(String) }
      )

      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when new name contains invalid characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name

      expect(adminQuizNameUpdate(userId, quizId, 'Invalid@Name!')).toStrictEqual(
        { error: expect.any(String) }
      )
      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when new name is less than 3 characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name
      expect(adminQuizNameUpdate(userId, quizId, 'AB')).toStrictEqual(
        { error: expect.any(String) }
      )

      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when new name is more than 30 characters', () => {
      let originalInfo = adminQuizInfo(userId, quizId)
      let originalName = originalInfo.name
      let longName = 'This name is way too long for a quiz name and exceeds thirty characters'

      expect(adminQuizNameUpdate(userId, quizId, longName)).toStrictEqual(
        { error: expect.any(String) }
      )

      let updatedInfo = adminQuizInfo(userId, quizId)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
    
    test('error when name is already used by same user', () => {
      let quiz2Result = adminQuizCreate(userId, 'Another Quiz', 'Another description')
      let quiz2Id = quiz2Result.quizId
      let originalInfo = adminQuizInfo(userId, quiz2Id)
      let originalName = originalInfo.name

      expect(adminQuizNameUpdate(userId, quiz2Id, 'Quiz Name')).toStrictEqual(
        { error: expect.any(String) }
      )
      
      let updatedInfo = adminQuizInfo(userId, quiz2Id)
      expect(updatedInfo.name).toStrictEqual(originalName)
    })
  })
})