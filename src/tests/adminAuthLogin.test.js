import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate
} from '../auth.js'
  
import {
  clear
} from '../other.js'

describe('tests for adminAuthLogin', () => {

  beforeEach(() => {
    clear();
  });

  describe('error tests', () => {
    test('email address does not exist', () => {
      adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974',
      'Joshua', 'Pozzolungo');
      expect(adminAuthLogin('doesnotexist@gmail.com', 'goodpassword123')).toStrictEqual({error: expect.any(String)})
    })
    test('password is not correct for given email', () => {
      adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974',
      'Joshua', 'Pozzolungo');
      expect(adminAuthLogin('jpozzolungo@gmail.com', 'incorrectpassword123')).toStrictEqual({error: expect.any(String)})
    })
  })

  describe('success tests', () => {
    test('correct return value', () => {
      const id = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974',
      'Joshua', 'Pozzolungo');
      expect(adminAuthLogin('jpozzolungo@gmail.com', 'thisisagoodpassword1974')).toStrictEqual(id)
    })
  })
})





