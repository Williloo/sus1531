import {
  adminQuizInfo,
  adminQuizCreate,
} from '../quiz.js'

import {
  adminAuthRegister,
} from '../auth.js'

import {
  clear
} from '../other.js'

let userId
let quizId

describe('tests for adminQuizInfo', () => {
  beforeEach(() => {
    clear()
    userId = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo').userId
    quizId = adminQuizCreate(userId, 'test quiz', 'This quiz is for testing adminQuizInfo function').quizId
  })

  test('invalid User', () => {
    expect(adminQuizInfo(userId + 1, quizId)).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('invalid Quiz', () => {
    expect(adminQuizInfo(userId, quizId+1)).toStrictEqual(
      { error: expect.any(String) }
    )
  })
  
  test('quiz ID Not Owned By Input User ID', () => {
    const newId = adminAuthRegister('Haoyuuuzz@gmail.com', 'thisisagoodpassword2025','Haoyu', 'Zhuang').userId
    const anotherQuizId = adminQuizCreate(newId, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input userid').quizId

    expect(adminQuizInfo(userId, anotherQuizId)).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('successful case', () => {
    expect(adminQuizInfo(userId,quizId)).toStrictEqual(
      {
        quizId: quizId,
        name:'test quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This quiz is for testing adminQuizInfo function',
      }
    )
  })
})