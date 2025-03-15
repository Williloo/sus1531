import { adminAuthRegister } from '../auth.js';
import { adminQuizCreate } from '../quiz.js';
import { clear } from '../others.js';

describe('Tests for adminQuizCreate', () => {
    beforeEach(() => {
        clear();
    });

    describe('Error cases', () => {
        test('Invalid userId', () => {
            expect(adminQuizCreate(-1, 'Valid Name', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name contains invalid characters', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            expect(adminQuizCreate(userId, 'Invalid@Name!', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is too short', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            expect(adminQuizCreate(userId, 'AB', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is too long', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            expect(adminQuizCreate(userId, 'A'.repeat(31), 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is already used by the same user', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            adminQuizCreate(userId, 'Duplicate Quiz', 'Valid description'); // First creation succeeds
            expect(adminQuizCreate(userId, 'Duplicate Quiz', 'Another description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Description is too long', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            expect(adminQuizCreate(userId, 'Valid Name', 'A'.repeat(101))).toStrictEqual({
                error: expect.any(String)
            });
        });
    });

    describe('Success cases', () => {
        test('Valid quiz creation', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            const result = adminQuizCreate(userId, 'My Quiz', 'This is a valid quiz description.');
            expect(result).toStrictEqual({
                quizId: expect.any(Number)
            });
        });

        test('Valid quiz creation with empty description', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe');
            const result = adminQuizCreate(userId, 'Another Quiz', '');
            expect(result).toStrictEqual({
                quizId: expect.any(Number)
            });
        });
    });
});
