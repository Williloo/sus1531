import {
  adminAuthRegister,
  adminAuthLogin,
} from '../auth.js'
  
import {
  clear,
} from '../other.js'

let id
describe('tests for adminAuthLogin', () => {
  beforeEach(() => {
    clear()
    id = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974','Joshua', 'Pozzolungo')
  })

  describe('error tests', () => {
    test('email address does not exist', () => {
      expect(adminAuthLogin('doesnotexist@gmail.com', 'goodpassword123')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('password is not correct for given email', () => {
      expect(adminAuthLogin('jpozzolungo@gmail.com', 'incorrectpassword123')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('success tests', () => {
    test('correct return value', () => {
      expect(adminAuthLogin('jpozzolungo@gmail.com', 'thisisagoodpassword1974')).toStrictEqual(
        id
      )
    })

    test('email address is case insensitive', () => {
      expect(adminAuthLogin('JPOZZOLUNGO@GMAIL.COM', 'thisisagoodpassword1974')).toStrictEqual(
        id
      )
    })
  })
})





