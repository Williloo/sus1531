import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuestionCreate,
  adminQuestionRemove,
  adminQuizInfo,
} from '../requests';

import {
  QuizDetails
} from '../interface';

describe('DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
  let sessionToken: string;
  let quizId: number;
  let questionId: number;

  beforeEach(() => {
    clear();
    const reg = adminAuthRegister(
      'test@example.com',
      'password',
      'Test',
      'User'
    ) as { session: string };
    sessionToken = reg.session;

    const quizResult = adminQuizCreate(
      sessionToken, 'Geography Quiz', 'A quiz for Geography students in year 11'
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
      sessionToken, quizId,
      questionBody.question, questionBody.timeLimit,
      questionBody.points, questionBody.answerOptions
    ) as { questionId: number };
    questionId = questionResult.questionId;

    adminQuestionCreate(
      sessionToken, quizId,
      questionBody.question, questionBody.timeLimit,
      questionBody.points, questionBody.answerOptions
    );
  });

  describe('Success cases', () => {
    test('Successfully deletes a question from a quiz', () => {
      const res = adminQuestionRemove(sessionToken, quizId, questionId);
      expect(res).toStrictEqual({});

      const quizInfo = adminQuizInfo(sessionToken, quizId);

      expect(quizInfo).toStrictEqual({
        quizId: quizId,
        name: 'Geography Quiz',
        timeCreated: (quizInfo as QuizDetails).timeCreated,
        timeLastEdited: expect.any(Number),
        description: 'A quiz for Geography students in year 11',
        numQuestions: 0,
        questions: [],
        timeLimit: 0
      });
    });

    test('Successfully deletes only the specified question when multiple exist', () => {
      const questionBody2 = {
        question: 'What is the capital of Germany?',
        timeLimit: 10,
        points: 5,
        answerOptions: [
          { answer: 'Berlin', correct: true },
          { answer: 'Munich', correct: false },
          { answer: 'Hamburg', correct: false }
        ]
      };

      const question2Result = adminQuestionCreate(
        sessionToken, quizId,
        questionBody2.question, questionBody2.timeLimit,
        questionBody2.points, questionBody2.answerOptions
      ) as { questionId: number };

      // Delete the first question
      adminQuestionRemove(sessionToken, quizId, questionId);

      // Check that only the second question remains
      const quizInfo = adminQuizInfo(sessionToken, quizId) as QuizDetails;
      expect(quizInfo.questions.length).toStrictEqual(1);
      expect(quizInfo.questions[0].questionId).toStrictEqual(question2Result.questionId);
    });
  });

  describe('Error cases', () => {
    test('401: Invalid session token', () => {
      const res = adminQuestionRemove('invalid-session', quizId, questionId);
      expect(res).toStrictEqual(401);
    });

    test('Invalid question ID (not in quiz)', () => {
      const res = adminQuestionRemove(sessionToken, quizId, 9999);
      expect(res).toStrictEqual(400);
    });

    test('User is not owner of this quiz', () => {
      const otherUser = adminAuthRegister(
        'other@example.com',
        'pass123',
        'Other',
        'User'
      ) as { session: string };
      const res = adminQuestionRemove(otherUser.session, quizId, questionId);
      expect(res).toStrictEqual(403);
    });

    test('Quiz does not exist', () => {
      const res = adminQuestionRemove(sessionToken, 9999, questionId);
      expect(res).toStrictEqual(403);
    });
  });
});
