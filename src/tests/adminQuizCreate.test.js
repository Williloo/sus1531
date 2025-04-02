import {
  adminAuthRegister,
} from '../auth'

import {
  adminQuizCreate,
} from '../quiz'

import {
  clear,
} from '../other'

let user
describe('tests for adminQuizCreate', () => {
  beforeEach(() => {
    clear()
    user = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe')
  })

  describe('error_msg cases', () => {
    test('invalid userId', () => {
      let userId = user.userId

      expect(adminQuizCreate(userId-1, 'Valid Name', 'Valid description')).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })

    test('name contains invalid characters', () => {
      let userId = user.userId

      expect(adminQuizCreate(userId, 'Invalid@Name!', 'Valid description')).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })

    test('name is too short', () => {
      let userId = user.userId

      expect(adminQuizCreate(userId, 'AB', 'Valid description')).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })

    test('name is too long', () => {
      let userId = user.userId

      expect(adminQuizCreate(userId, 'A'.repeat(31), 'Valid description')).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })

    test('name is already used by the same user', () => {
      let userId = user.userId

      adminQuizCreate(userId, 'Duplicate Quiz', 'Valid description')
      expect(adminQuizCreate(userId, 'Duplicate Quiz', 'Another description')).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })

    test('description is too long', () => {
      let userId = user.userId

      expect(adminQuizCreate(userId, 'Valid Name', 'A'.repeat(101))).toStrictEqual(
        { error_msg: expect.any(String) }
      )
    })
  })

  describe('success cases', () => {
    test('valid quiz creation', () => {
      let userId = user.userId

      const result = adminQuizCreate(userId, 'My Quiz', 'This is a valid quiz description.')
      expect(result).toStrictEqual(
        { quizId: expect.any(Number) }
      )
    })

    test('valid quiz creation with empty description', () => {
      let userId = user.userId

      const result = adminQuizCreate(userId, 'Another Quiz', '')
      expect(result).toStrictEqual(
        { quizId: expect.any(Number) }
      )
    })
  })
})
