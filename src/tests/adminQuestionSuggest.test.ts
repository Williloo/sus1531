import {
  adminQuestionSuggestion,
  adminQuizCreate,
  adminAuthRegister,
  clear
} from '../requests';

describe('tests for adminQuestionSuggestion', () => {
  let sessionToken: string;
  let quizId: number;

  beforeEach(() => {
    clear();

    const registerResult = adminAuthRegister(
      'user@example.com', 'password123', 'user', 'one'
    ) as { session: string };
    sessionToken = registerResult.session;

    const quizResult = adminQuizCreate(
      sessionToken, 'Chemistry Quiz', 'A quiz for chemistry students in year 11'
    ) as { quizId: number };
    quizId = quizResult.quizId;
  });

  describe('success tests', () => {
    test('provides valid output question 1', () => {
      const question = adminQuestionSuggestion(sessionToken, quizId);
      expect(question).toStrictEqual({
        question: expect.any(String)
      });

      expect(
        (question as { question: string }).question.length
      ).toBeGreaterThanOrEqual(5);
      expect(
        (question as { question: string }).question.length
      ).toBeLessThanOrEqual(50);
    });

    test('provides valid output question 2', () => {
      const quizResult2 = adminQuizCreate(
        sessionToken, 'Maths Quiz', 'A quiz for first year uni maths students preparing for finals'
      ) as { quizId: number };
      const quizId2 = quizResult2.quizId;

      const question = adminQuestionSuggestion(sessionToken, quizId2);
      expect(question).toStrictEqual({
        question: expect.any(String)
      });

      expect(
        (question as { question: string }).question.length
      ).toBeGreaterThanOrEqual(5);
      expect(
        (question as { question: string }).question.length
      ).toBeLessThanOrEqual(50);
    });
  });

  describe('error tests', () => {
    test('empty session', () => {
      const question = adminQuestionSuggestion('', quizId);
      expect(question).toStrictEqual(401);
    });

    test('invlid session', () => {
      const question = adminQuestionSuggestion('1_4m_a_m4L1cI0u5_h4cK3R', quizId);
      expect(question).toStrictEqual(401);
    });

    test('user does not own quiz', () => {
      const registerResult2 = adminAuthRegister(
        'another@example.com', 'password123', 'another', 'one'
      ) as { session: string };
      const sessionToken2 = registerResult2.session;

      const question = adminQuestionSuggestion(sessionToken2, quizId);
      expect(question).toStrictEqual(403);
    });

    test('quiz does not exist', () => {
      const question = adminQuestionSuggestion(sessionToken, quizId + 1);
      expect(question).toStrictEqual(403);
    });
  });
});
