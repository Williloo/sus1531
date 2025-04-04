import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizList,
  clear
} from '../requests';

import {
  QuizDetails
} from '../interface';

describe('tests for adminQuizCreate', () => {
  let sessionToken: string;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'jpozzolungo@gmail.com', 'thisisagoodpassword1974', 'Joshua', 'Pozzolungo'
    );

    expect(registerResult).toHaveProperty('sessionId');
    sessionToken = (registerResult as { sessionId: string }).sessionId;
  });

  describe('Success tests', () => {
    test('Successfully creates a new quiz', () => {
      const res = adminQuizCreate(sessionToken, 'My Test Quiz', 'This is a test quiz description');
      const timestamp: number = Math.floor(Date.now() / 1000);

      expect(res).toStrictEqual({
        quizId: expect.any(Number)
      });

      const quizData = adminQuizInfo(sessionToken, (res as { quizId: number }).quizId);
      expect(quizData).toStrictEqual({
        quizId: (res as { quizId: number }).quizId,
        name: 'My Test Quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This is a test quiz description',
        numQuestions: 0,
        questions: [],
        timeLimit: 0
      });

      expect((quizData as QuizDetails).timeCreated).toStrictEqual(
        (quizData as QuizDetails).timeLastEdited
      );
      expect(Math.abs(timestamp - (quizData as QuizDetails).timeCreated)).toBeLessThan(1000);

      const quizList = adminQuizList(sessionToken);
      expect((quizList as QuizDetails[])).toContainEqual({
        quizId: (res as { quizId: number }).quizId,
        name: 'My Test Quiz'
      });
    });

    test('Empty description is allowed', () => {
      const res = adminQuizCreate(sessionToken, 'Valid Quiz Name', '');
      expect(res).toStrictEqual({
        quizId: expect.any(Number)
      });

      const quizList = adminQuizList(sessionToken);
      expect((quizList as QuizDetails[])).toContainEqual({
        quizId: (res as { quizId: number }).quizId,
        name: 'Valid Quiz Name'
      });
    });

    test('Same quiz name can be used by different users', () => {
      const res1 = adminQuizCreate(sessionToken, 'Common Quiz Name', 'First user description');

      const register2Result = adminAuthRegister(
        'user2@example.com', 'password123', 'Jane', 'Smith'
      );

      expect(register2Result).toHaveProperty('sessionId');
      const sessionToken2 = (register2Result as { sessionId: string }).sessionId;

      // Create quiz with same name for second user
      const res2 = adminQuizCreate(sessionToken2, 'Common Quiz Name', 'Second user description');
      expect(res2).toStrictEqual({
        quizId: expect.any(Number)
      });

      const quizList1 = adminQuizList(sessionToken);
      expect((quizList1 as QuizDetails[])).toContainEqual({
        quizId: (res1 as { quizId: number }).quizId,
        name: 'Common Quiz Name'
      });

      const quizList2 = adminQuizList(sessionToken2);
      expect((quizList2 as QuizDetails[])).toContainEqual({
        quizId: (res2 as { quizId: number }).quizId,
        name: 'Common Quiz Name'
      });
    });

    test('Quiz IDs are unique', () => {
      const res1 = adminQuizCreate(sessionToken, 'First Quiz', 'First quiz description');
      const res2 = adminQuizCreate(sessionToken, 'Second Quiz', 'Second quiz description');

      expect(res1).toStrictEqual({
        quizId: expect.any(Number)
      });
      expect(res2).toStrictEqual({
        quizId: expect.any(Number)
      });

      expect((res1 as { quizId: number }).quizId).not.toEqual((res2 as { quizId: number }).quizId);
    });

    test('Quiz with name containing numbers and spaces is valid', () => {
      const res = adminQuizCreate(sessionToken, 'Quiz 123 With Spaces', 'This is a valid quiz');
      expect(res).toStrictEqual({
        quizId: expect.any(Number)
      });
    });
  });

  describe('Error tests', () => {
    test('Error when session is invalid', () => {
      const res = adminQuizCreate(
        'invalid-session-token', 'My Test Quiz', 'This is a test quiz description'
      );
      expect(res).toStrictEqual(401);

      // Check quiz was not created
      const quizList = adminQuizList(sessionToken) as QuizDetails[];
      expect(quizList.find(quiz => quiz.name === 'My Test Quiz')).toBeUndefined();
    });

    test('Error when session is empty', () => {
      const res = adminQuizCreate('', 'My Test Quiz', 'This is a test quiz description');
      expect(res).toStrictEqual(401);
    });

    test('Error when name contains invalid characters', () => {
      const res = adminQuizCreate(
        sessionToken, 'Invalid@Quiz#Name', 'This is a test quiz description'
      );
      expect(res).toStrictEqual(400);

      const quizList: QuizDetails[] = adminQuizList(sessionToken) as QuizDetails[];
      expect(quizList.find(quiz => quiz.name === 'Invalid@Quiz#Name')).toBeUndefined();
    });

    test('Error when name is too short (less than 3 characters)', () => {
      const res = adminQuizCreate(sessionToken, 'AB', 'This is a test quiz description');
      expect(res).toStrictEqual(400);

      const quizList: QuizDetails[] = adminQuizList(sessionToken) as QuizDetails[];
      expect(quizList.find(quiz => quiz.name === 'AB')).toBeUndefined();
    });

    test('Error when name is too long (more than 30 characters)', () => {
      const longName = 'This quiz name is way too long and exceeds' +
      'the maximum length of thirty characters';
      const res = adminQuizCreate(
        sessionToken,
        longName,
        'This is a test quiz description'
      );
      expect(res).toStrictEqual(400);

      const quizList: QuizDetails[] = adminQuizList(sessionToken) as QuizDetails[];
      expect(quizList.find(quiz => quiz.name.includes('way too long'))).toBeUndefined();
    });

    test('Error when name is already used by the same user', () => {
      adminQuizCreate(sessionToken, 'Duplicate Quiz Name', 'First quiz description');
      const res = adminQuizCreate(sessionToken, 'Duplicate Quiz Name', 'Second quiz description');
      expect(res).toStrictEqual(400);

      const quizList: QuizDetails[] = adminQuizList(sessionToken) as QuizDetails[];
      const duplicateQuizzes = quizList.filter(quiz => quiz.name === 'Duplicate Quiz Name');
      expect(duplicateQuizzes.length).toStrictEqual(1);
    });

    test('Error when description is too long (more than 100 characters)', () => {
      const longDescription = 'A'.repeat(101);
      const res = adminQuizCreate(sessionToken, 'Valid Quiz Name', longDescription);
      expect(res).toStrictEqual(400);

      const quizList: QuizDetails[] = adminQuizList(sessionToken) as QuizDetails[];
      expect(quizList.find(quiz => quiz.name === 'Valid Quiz Name')).toBeUndefined();
    });
  });
});
