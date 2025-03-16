import {
  clear
} from '../other.js'

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserPasswordUpdate
} from '../auth.js'

let user
beforeEach(() => {
  clear()
  user = adminAuthRegister( "123@gmail.com", "password123", "my", "name" )
})

describe('tests for adminUserPasswordUpdate', () => {
  test('invalid user id', () => {
    let invalidUid = user.userId + 1

    expect(adminUserPasswordUpdate(invalidUid)).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('incorrect old password', () => {
    let uid = user.userId

    expect(adminUserPasswordUpdate(uid, "password456", "some random old text")).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('old and new password match exactly', () => {
    let uid = user.userId

    expect(adminUserPasswordUpdate(uid, "password123", "password123")).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('new password used before', () => {
    let uid = user.userId
    adminUserPasswordUpdate(uid, "password123", "password456")

    expect(adminUserPasswordUpdate(uid, "password456", "password123")).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  test('new password less than 8 characters', () => {
    let uid = user.userId

    expect(adminUserPasswordUpdate(uid, "password123", "short")).toStrictEqual(
      { error: expect.any(String) }
    )
  })

  describe('new password does not contain at least 1 number or letter', () => {
    test('no number', () => {
      let uid = user.userId

      expect(adminUserPasswordUpdate(uid, "password123", "1234567")).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('no letter', () => {
      let uid = user.userId

      expect(adminUserPasswordUpdate(uid, "password123", "abcdefg")).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  test('success case', () => {
    let uid = user.userId

    adminUserPasswordUpdate(uid, "password123", "password456")

    expect(adminAuthLogin("123@gmail.com", "password456")).toStrictEqual(
      { userId: uid }
    )
  })
})