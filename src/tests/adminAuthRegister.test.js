import {
  adminAuthRegister,
} from '../auth.js'

import {
  clear,
} from '../other.js'

describe('tests for adminAuthRegister', () => {
  beforeEach(() => {
    clear()
  })
  
  describe('error tests for Password', () => {
    test('password is less than 8 characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hi1974', 'Bob', 'Builder')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('password does not contain at least one number', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'mypasswordisgood', 'Bob', 'Builder')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('password does not contain at least one letter', () => {
      expect(adminAuthRegister('randomemail@gmail.com', '197420062802', 'Bob', 'Builder')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('error tests for NameLast', () => {
    test('nameLast is less than 2 characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'Panda', 'P')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('nameLast is more than 20 characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'Josh', 'Thisisaverylongnameyouseemenow')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('nameLast contains invalid characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'Panda', 'mylastname||~~')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('error tests for NameFirst', () => {
    test('nameFirst is less than 2 characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'J', 'Panda')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('nameFirst is more than 20 characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'Thisisaverylongnameyouseemenow', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('nameFirst contains invalid characters', () => {
      expect(adminAuthRegister('randomemail@gmail.com', 'hello', 'invalid}{|!', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('error tests for email', () => {
    test('does not satisfy validator function', () => {
      expect(adminAuthRegister('notavalidemail//', 'thisagoodpassword198', 'Joshua', 'Pozz')).toStrictEqual(
        { error: expect.any(String) }
      )
    })

    test('email address is used by another user.', () => {
      adminAuthRegister('studentunsw@gmail.com','thisagoodpassword198','Joshua', 'Pozz')
      
      expect(adminAuthRegister('studentunsw@gmail.com', 'thisagooddifferentpassword198', 'Panda', 'Po')).toStrictEqual(
        { error: expect.any(String) }
      )
    })
  })

  describe('success cases', () => {
    test('all valid fields', () => {
      expect(adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo')).toStrictEqual(
        { userId: expect.any(Number) }
      )
    })
  })
})




