import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuestionCreate,
  adminQuestionUpdate,
  adminQuizInfo,
} from '../requests';

describe('PUT /v1/admin/quiz/:quizid/question/:questionid', () => {
  let session: string;
  let quizId: number;
  let questionId: number;

  beforeEach(() => {
    clear();
    const reg = adminAuthRegister(
      'testuser@example.com',
      'password123',
      'Test',
      'User'
    ) as { session: string };

    session = reg.session;

    const quizResult = adminQuizCreate(
      session, 'Chemistry Quiz', 'A quiz for chemistry students in year 11'
    ) as { quizId: number };
    quizId = quizResult.quizId;

    const questionBody = {
      question: 'What is the capital of France?',
      timeLimit: 10,
      points: 5,
      answerOptions: [
        { answer: 'Paris', correct: true },
        { answer: 'London', correct: false },
        { answer: 'Berlin', correct: false }
      ]
    };

    const questionResult = adminQuestionCreate(
      session, quizId,
      questionBody.question, questionBody.timeLimit,
      questionBody.points, questionBody.answerOptions
    ) as { questionId: number };
    questionId = questionResult.questionId;
  });

  describe('Success case', () => {
    test('Successfully updates a quiz question', () => {
      const updateRes = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'Who is the Monarch of England?',
          timeLimit: 30,
          points: 7,
          answerOptions: [
            { answer: 'Prince Charles', correct: true },
            { answer: 'Queen Elizabeth', correct: false },
          ],
        },
      });
      expect(updateRes).toStrictEqual({});

      // TO DO CHECK
      const info = adminQuizInfo(session, quizId) as { questions: Array<any> };
      const updatedQuestion = info.questions.find(q => q.questionId === questionId);

      expect(updatedQuestion.question).toBe('Who is the Monarch of England?');
      expect(updatedQuestion.timeLimit).toBe(30);
      expect(updatedQuestion.points).toBe(7);
      expect(updatedQuestion.answers.length).toBe(2);
    });
  });

  describe('Error cases', () => {
    test('Invalid session token', () => {
      const res = adminQuestionUpdate('invalid-session', quizId, questionId, {
        questionBody: {
          question: 'Who is the Monarch of England?',
          timeLimit: 30,
          points: 7,
          answerOptions: [
            { answer: 'Prince Charles', correct: true },
            { answer: 'Queen Elizabeth', correct: false },
          ],
        },
      });
      expect(res).toBe(401);
    });

    test('Valid session, but not quiz owner', () => {
      const otherUser = adminAuthRegister('other@example.com', 'pass123', 'Other', 'User');

      const session2 = (otherUser as { session: string }).session;
      const res = adminQuestionUpdate(session2, quizId, questionId, {
        questionBody: {
          question: 'New Question?',
          timeLimit: 30,
          points: 5,
          answerOptions: [
            { answer: 'A', correct: true },
            { answer: 'B', correct: false },
          ],
        },
      });
      expect(res).toBe(403);
    });

    test('Invalid questionId', () => {
      const res = adminQuestionUpdate(session, quizId, 9999, {
        questionBody: {
          question: 'Valid question',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: 'X', correct: true },
            { answer: 'Y', correct: false },
          ],
        },
      });
      expect(res).toBe(400);
    });

    test('Question too short', () => {
      const res = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'Hi',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: 'Yes', correct: true },
            { answer: 'No', correct: false },
          ],
        },
      });
      expect(res).toBe(400);
    });

    test('Only 1 answer provided', () => {
      const res = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'Valid Question',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: 'Only option', correct: true },
          ],
        },
      });
      expect(res).toBe(400);
    });

    test('Duplicate answers', () => {
      const res = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'Duplicate answers?',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: 'Duplicate', correct: true },
            { answer: 'Duplicate', correct: false },
          ],
        },
      });
      expect(res).toBe(400);
    });

    test('No correct answers', () => {
      const res = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'No correct?',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: 'Option A', correct: false },
            { answer: 'Option B', correct: false },
          ],
        },
      });
      expect(res).toBe(400);
    });

    test('Answer too long', () => {
      const longAnswer = 'A'.repeat(31);
      const res = adminQuestionUpdate(session, quizId, questionId, {
        questionBody: {
          question: 'Valid Q',
          timeLimit: 20,
          points: 5,
          answerOptions: [
            { answer: longAnswer, correct: true },
            { answer: 'Short', correct: false },
          ],
        },
      });
      expect(res).toBe(400);
    });
  });

  test('Error when updated question would make total quiz time exceed 3 minutes', () => {
    // Create another question with time close to the limit
    const longQuestionBody = {
      question: 'Another valid question?',
      timeLimit: 170, // 2m50s
      points: 5,
      answerOptions: [
        { answer: 'A', correct: true },
        { answer: 'B', correct: false },
      ]
    };

    adminQuestionCreate(
      session, quizId,
      longQuestionBody.question, longQuestionBody.timeLimit,
      longQuestionBody.points, longQuestionBody.answerOptions
    );

    const res = adminQuestionUpdate(session, quizId, questionId, {
      questionBody: {
        question: 'Valid question',
        timeLimit: 11, // total 181s > 180s (3 min)
        points: 5,
        answerOptions: [
          { answer: 'X', correct: true },
          { answer: 'Y', correct: false },
        ],
      },
    });
    expect(res).toStrictEqual(400);
  });
});
