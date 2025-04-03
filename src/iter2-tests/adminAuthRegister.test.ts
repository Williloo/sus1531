import {
    adminAuthRegister,
    clear
  } from '../requests'

  // TO DO: a way to check registered users
  
  describe('tests for adminAuthRegister', () => {
    beforeEach(() => {
      clear()
    })
  
    describe('Success tests', () => {
      test('Successfully registers with valid inputs', () => {
        const result = adminAuthRegister('jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo')
        expect(result).toStrictEqual({
          session: expect.any(String)
        })
      })
  
      test('Successfully registers with valid special characters in names', () => {
        const result = adminAuthRegister('user@example.com', 'password123', "O'Connor", 'Smith-Jones')
        expect(result).toStrictEqual({
          session: expect.any(String)
        })
      })
  
      test('Successful registrations generate unique session tokens', () => {
        const res1 = adminAuthRegister('user1@example.com', 'password123', 'John', 'Doe')
        const res2 = adminAuthRegister('user2@example.com', 'password123', 'Jane', 'Smith')
        
        expect(res1).toStrictEqual({
          session: expect.any(String)
        })
        
        expect(res2).toStrictEqual({
          session: expect.any(String)
        })
  
        expect(res1.session).not.toEqual(res2.session)
      })
    })

    describe('Error tests', () => {
      describe('Password errors', () => {
        test('Error when password is less than 8 characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'hi1974', 'Bob', 'Builder')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when password does not contain at least one number', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'mypasswordisgood', 'Bob', 'Builder')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when password does not contain at least one letter', () => {
          const result = adminAuthRegister('randomemail@gmail.com', '197420062802', 'Bob', 'Builder')
          expect(result).toStrictEqual(400)
        })
      })
    
      describe('Last name errors', () => {
        test('Error when last name is less than 2 characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'Panda', 'P')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when last name is more than 20 characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'Josh', 'Thisisaverylongnameyouseemenow')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when last name contains invalid characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'Panda', 'mylastname||~~')
          expect(result).toStrictEqual(400)
        })
      })
    
      describe('First name errors', () => {
        test('Error when first name is less than 2 characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'J', 'Panda')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when first name is more than 20 characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'Thisisaverylongnameyouseemenow', 'Po')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when first name contains invalid characters', () => {
          const result = adminAuthRegister('randomemail@gmail.com', 'password123', 'invalid}{|!', 'Po')
          expect(result).toStrictEqual(400)
        })
      })
    
      describe('Email errors', () => {
        test('Error when email does not satisfy validator function', () => {
          const result = adminAuthRegister('notavalidemail//', 'password123', 'Joshua', 'Pozz')
          expect(result).toStrictEqual(400)
        })
    
        test('Error when email address is already in use', () => {
          adminAuthRegister('studentunsw@gmail.com', 'password123', 'Joshua', 'Pozz')
    
          // Try register second user with same email
          const result = adminAuthRegister('studentunsw@gmail.com', 'differentpassword123', 'Panda', 'Po')
          expect(result).toStrictEqual(400)
        })
      })
    })
  })