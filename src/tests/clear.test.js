import {
  clear
} from './others';

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate
} from './auth';

import {
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate
} from './quiz';

let userId;
let quizId;

beforeEach(() => {
  const result = adminAuthRegister('hayden.smith@unsw.edu.au', 'myPassword', 'Hayden', 'Smith');
  userId = result.userId;
});

describe('clear', () => {
  test('has correct return type, {  }', () => {
    expect(clear()).toStrictEqual({});
  });

  test('Test for clearing after adminAuthRegister', () => {
    clear();
    expect(adminUserDetails(userId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminAuthLogin', () => {
    const loginResult = adminAuthLogin('hayden.smith@unsw.edu.au', 'myPassword');
    const loginId = loginResult.userId;
    clear();
    expect(adminUserDetails(loginId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminUserDetailsUpdate', () => {
    adminUserDetailsUpdate(userId, 'hayden.smith@unsw.edu.au', 'Hayden', 'Smith');
    clear();
    expect(adminUserDetails(userId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminUserPasswordUpdate', () => {
    adminUserPasswordUpdate(userId, 'myPassword', 'newPassword');
    clear();
    expect(adminUserDetails(userId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminQuizCreate', () => {
    const quizResult = adminQuizCreate(userId, 'quizTest', 'This quiz is for ...');
    quizId = quizResult.quizId;
    clear();
    expect(adminQuizList(userId)).toStrictEqual({ error: expect.any(String) });
    expect(adminQuizInfo(userId, quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminQuizNameUpdate', () => {
    const quizResult = adminQuizCreate(userId, 'Hayden Smith', 'This quiz is for ...');
    quizId = quizResult.quizId;
    adminQuizNameUpdate(userId, quizId, 'newQuizName');
    clear();
    expect(adminQuizList(userId)).toStrictEqual({ error: expect.any(String) });
    expect(adminQuizInfo(userId, quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminQuizDescriptionUpdate', () => {
    const quizResult = adminQuizCreate(userId, 'Hayden Smith', 'This quiz is for ...');
    quizId = quizResult.quizId;
    adminQuizDescriptionUpdate(userId, quizId, 'This quiz description is now changed to...');
    clear();
    expect(adminQuizList(userId)).toStrictEqual({ error: expect.any(String) });
    expect(adminQuizInfo(userId, quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test for clearing after adminQuizRemove', () => {
    const quizResult = adminQuizCreate(userId, 'Hayden Smith', 'This quiz is for ...');
    quizId = quizResult.quizId;
    adminQuizRemove(userId, quizId);
    clear();
    expect(adminQuizList(userId)).toStrictEqual({ error: expect.any(String) });
    expect(adminQuizInfo(userId, quizId)).toStrictEqual({ error: expect.any(String) });
  });
});