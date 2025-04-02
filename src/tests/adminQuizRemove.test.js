import {
  adminQuizRemove,
  adminQuizCreate,
} from '../quiz';

import {
  adminAuthRegister,
} from '../auth';

import {
  clear,
} from '../other';

let userId;
let quizId;

describe('tests for adminQuizRemove', () => {
  beforeEach(() => {
    clear();
    userId = adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    ).userId;

    quizId = adminQuizCreate(
      userId, 'test quiz', 'This quiz is for testing adminQuizRemove function'
    ).quizId;
  });

  test('invalid User', () => {
    expect(adminQuizRemove(userId + 1, quizId)).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('invalid Quiz', () => {
    expect(adminQuizRemove(userId, quizId + 1)).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('quiz ID Not Owned By Input User ID', () => {
    const newId = adminAuthRegister(
      'Haoyuuuzz@gmail.com', 'thisisagoodpassword2025', 'Haoyu', 'Zhuang'
    ).userId;
    const anotherQuizId = adminQuizCreate(
      newId, 'test quiz 2', 'This quiz is for testing if the quiz Id is owned by input userid'
    ).quizId;

    expect(adminQuizRemove(userId, anotherQuizId)).toStrictEqual(
      { error_msg: expect.any(String) }
    );
  });

  test('successfully remove quiz', () => {
    expect(adminQuizRemove(userId, quizId)).toStrictEqual(
      {}
    );
  });
});
