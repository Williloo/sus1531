import { adminQuizList, adminQuizCreate} from '../quiz.js';
import { adminAuthRegister} from '../auth.js';
import {clear} from '../others.js';

describe('Tests for adminQuizList', () => {
    beforeEach(() => {
        clear();
    });

    describe('Error cases', () => {
        test('Invalid userId', () => {
            expect(adminQuizList(-1)).toStrictEqual({ error: expect.any(String) });
        });
    });

    describe('Success cases', () => {
        test('Valid user with no quizzes', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'Yash', 'Mittal');
            expect(adminQuizList(userId)).toStrictEqual({ quizzes: [] });
        });

        test('Valid user with quizzes', () => {
            const { userId } = adminAuthRegister('validemail@gmail.com', 'Password123', 'Yash', 'Mittal');
            adminQuizCreate(userId, 'Quiz 1');
            adminQuizCreate(userId, 'Quiz 2');

            expect(adminQuizList(userId)).toStrictEqual({
                quizzes: [
                    { quizId: expect.any(Number), name: 'Quiz 1' },
                    { quizId: expect.any(Number), name: 'Quiz 2' }
                ]
            });
        });
    });
});