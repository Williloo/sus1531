import {
  clear
} from '../other.js'

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
} from '../auth.js'

let user

beforeEach(() => {
  clear()
  user = adminAuthRegister( "123@gmail.com", "123", "my", "name" )
})

describe('tests for adminUserDetails', () => {
  test('invalid user id', () => {
    let invalidUid = user.userId + 1

    expect(adminUserDetails(invalidUid).toStrictEqual(
      { error: expect.any(String) }
    ))
  })

  test('valid user id', () => {
    let uid = user.userId
    expect(adminUserDetails(uid).toStrictEqual(
      { user: {
          userId: uid,
          name: "my name",
          email: "123@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        } 
      }
    ))
  })

  test('multiple users', () => {
    let user2 = adminAuthRegister( "456@gmail.com", "456", "your", "moniker" )
    let uid1 = user1.userId
    let uid2 = user2.userId

    expect(adminUserDetails(uid1).toStrictEqual(
      { user: {
          userId: uid1,
          name: "my name",
          email: "123@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        } 
      }
    ))

    expect(adminUserDetails(uid2).toStrictEqual(
      { user: {
          userId: uid2,
          name: "your moniker",
          email: "456@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        } 
      }
    ))
  })
})