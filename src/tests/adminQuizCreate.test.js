import { adminAuthRegister } from '../auth.js';
import { adminQuizCreate } from '../quiz.js';
import { clear } from '../other.js';

describe('Tests for adminQuizCreate', () => {
    let user

    beforeEach(() => {
        clear();
        user = adminAuthRegister('validemail@gmail.com', 'Password123', 'John', 'Doe')
    });

    describe('Error cases', () => {
        test('Invalid userId', () => {
            expect(adminQuizCreate(-1, 'Valid Name', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name contains invalid characters', () => {
            let userId = user.userId
            expect(adminQuizCreate(userId, 'Invalid@Name!', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is too short', () => {
            let userId = user.userId
            expect(adminQuizCreate(userId, 'AB', 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is too long', () => {
            let userId = user.userId
            expect(adminQuizCreate(userId, 'A'.repeat(31), 'Valid description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Name is already used by the same user', () => {
            let userId = user.userId
            adminQuizCreate(userId, 'Duplicate Quiz', 'Valid description'); // First creation succeeds
            expect(adminQuizCreate(userId, 'Duplicate Quiz', 'Another description')).toStrictEqual({
                error: expect.any(String)
            });
        });

        test('Description is too long', () => {
            let userId = user.userId
            expect(adminQuizCreate(userId, 'Valid Name', 'A'.repeat(101))).toStrictEqual({
                error: expect.any(String)
            });
        });
    });

    describe('Success cases', () => {
        test('Valid quiz creation', () => {
            let userId = user.userId
            const result = adminQuizCreate(userId, 'My Quiz', 'This is a valid quiz description.');
            expect(result).toStrictEqual({
                quizId: expect.any(Number)
            });
        });

        test('Valid quiz creation with empty description', () => {
            let userId = user.userId
            const result = adminQuizCreate(userId, 'Another Quiz', '');
            expect(result).toStrictEqual({
                quizId: expect.any(Number)
            });
        });
    });
});
