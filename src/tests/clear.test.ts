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
//TO DO: using clear after a user is registered
//TO DO: using clear after a quiz is created
// TO DO: using clear after a question is created
});
