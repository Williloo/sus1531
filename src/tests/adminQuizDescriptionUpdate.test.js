import {
  clear,
} from '../other'
  
import {
  adminAuthRegister,
} from '../auth'
  
import {
  adminQuizCreate,
  adminQuizInfo,
  adminQuizDescriptionUpdate
} from '../quiz'

let userId
let quizId

describe('tests for adminQuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear()
    userId = adminAuthRegister('hayden.smith@unsw.edu.au', 'myPassword1', 'Hayden', 'Smith').userId
    quizId = adminQuizCreate(userId, 'Test Quiz', 'Original description').quizId
  })

  describe('success cases', () => {
    test('quiz description updated to a new description', () => {
      let quizInfo = adminQuizInfo(userId, quizId)

      expect(quizInfo.description).toStrictEqual('Original description')

      let originalTime = quizInfo.timeLastEdited
      let newDescription = 'This is an updated description'

      expect(adminQuizDescriptionUpdate(userId, quizId, newDescription)).toStrictEqual(
        {  }
      )

      quizInfo = adminQuizInfo(userId, quizId)

      expect(quizInfo.description).toStrictEqual(newDescription)
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(quizInfo.timeCreated)
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(originalTime)
    })

    test('empty description is allowed', () => {
      expect(adminQuizDescriptionUpdate(userId, quizId, '')).toStrictEqual({})

      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('')
    })

    test('multiple updates work correctly', () => {
      adminQuizDescriptionUpdate(userId, quizId, 'First update')
      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('First update')

      adminQuizDescriptionUpdate(userId, quizId, 'Second update')
      quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Second update')
      
      adminQuizDescriptionUpdate(userId, quizId, 'Third update')
      quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Third update')
    })
  })

  describe('error cases', () => {
    test('invalid userId provided would return error', () => {
      let invalidUserId = userId + 100
      let result = adminQuizDescriptionUpdate(invalidUserId, quizId, 'New description')

      expect(result).toStrictEqual(
        { error: expect.any(String) }
      )
      
      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Original description')
    })

    test('invalid quizId provided would return error', () => {
      let invalidQuizId = quizId + 100
      let result = adminQuizDescriptionUpdate(userId, invalidQuizId, 'New description')

      expect(result).toStrictEqual(
        { error: expect.any(String) }
      )
      
      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Original description')
    })

    test('trying to update description of a quiz that is not owned by an user will return error', () => {
      let secondUserResult = adminAuthRegister('another@example.com', 'Password123', 'Another', 'User')
      let secondUserId = secondUserResult.userId
      let result = adminQuizDescriptionUpdate(secondUserId, quizId, 'New description')

      expect(result).toStrictEqual(
        { error: expect.any(String) }
      )
      
      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Original description')
    })

    test('new description longer than 100 characters should return an error', () => {
      let longDescription = 'a'.repeat(101)
      let result = adminQuizDescriptionUpdate(userId, quizId, longDescription)
      expect(result).toStrictEqual(
        { error: expect.any(String) }
      )

      let quizInfo = adminQuizInfo(userId, quizId)
      expect(quizInfo.description).toStrictEqual('Original description')
    })
  })
})