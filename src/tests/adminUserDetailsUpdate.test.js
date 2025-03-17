import {
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate
} from '../auth.js'
  
import {
  clear
} from '../other.js'
  
let user

beforeEach(() => {
  clear();
  user = adminAuthRegister( "123@gmail.com", "password123", "my", "name" )
});

describe('tests for adminUserDetailUpdate', () => {
  test('error test for invalid userId', () => {
    let invalidUid = user.userId + 1

    expect(adminUserDetailsUpdate(invalidUid, "123@gmail.com", "my", "name")).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  describe('error tests for NameLast', () => {
    test('NameLast is less than 2 characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'Panda', 'P')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('NameLast is more than 20 characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'Josh', 'Thisisaverylongnameyouseemenow')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('NameLast contains invalid characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'Panda', 'mylastname||~~')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('error tests for NameFirst', () => {
    test('NameFirst is less than 2 characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'J', 'Panda')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('NameFirst is more than 20 characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'Thisisaverylongnameyouseemenow', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('NameFirst contains invalid characters', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'randomemail@gmail.com', 'invalid}{|!', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('error tests for email', () => {
    test('does not satisfy validator function', () => {
      let uid = user.userId

      expect(adminUserDetailsUpdate(uid, 'notavalidemail//', 'Joshua', 'Pozz')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('Email address is used by another user.', () => {
      let uid = user.userId

      adminAuthRegister('studentunsw@gmail.com','thisagoodpassword198', 'Joshua', 'Pozz')
      expect(adminUserDetailsUpdate(uid, 'studentunsw@gmail.com', 'Panda', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('success cases', () => {
    test('all valid fields', () => {
      let uid = user.userId

      adminUserDetailsUpdate(uid, 'jpozzolungo@gmail.com', 'Joshua', 'Pozzolungo')

      expect(adminUserDetails(uid)).toStrictEqual(
        {
          user: {
            userId: uid,
            name: "Joshua Pozzolungo",
            email: "jpozzolungo@gmail.com",
            numSuccessfulLogins: 0,
            numFailedPasswordsSinceLastLogin: 0,
          } 
        }
      )
    })
  })
})