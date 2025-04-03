import {
  // adminAuthRegister,
  // adminAuthLogin,
  // adminUserDetails,
  // adminQuizCreate,
  // adminQuizList,
  // adminQuizInfo,
  clear
} from '../requests';

describe('DELETE /v1/clear', () => {
  test('Clearing returns an empty object', () => {
    expect(clear()).toStrictEqual({});
  });

  test('Successfully clears all data', () => {
    // TO DO
  });
});
