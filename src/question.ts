import {
  getData, updateData,
  Data, Quiz, Question, AnswerOption, Error
} from './dataStore'

import {
  checkUserExists,
  checkQuestionName,
  findQuiz,
  checkQuestionProperties
} from './helpers'

export function adminQuestionCreate(
  userId: number, quizId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]
): Error | { questionId: number } {
  const store: Data = getData();

  // Check if userId is valid
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'userId is not a valid user.',
      error_code: 401
    };
  }

  // Search for existing quiz
  const quiz: null | Quiz = findQuiz(userId, quizId, store.quizzes);
  if (!quiz) {
    return {
      error_msg: 'Quiz does not exist',
      error_code: 403
    };
  }

  // Check question name
  if (!checkQuestionName(question)) {
    return {
      error_msg: 'invalid quiz name',
      error_code: 400
    };
  }

  // Check if question and answers are valid
  if (!checkQuestionProperties(
    answerOptions, timeLimit, points
  )) {
    return {
      error_msg: 'invalid question or answer',
      error_code: 400
    }
  }

  // Check if timeLimits run over
  let time: number = timeLimit;

  for (const question of quiz.questions) {
    time += question.timeLimit;
  }

  if (time > 3 * 60) {
    return {
      error_msg: 'quiz exceeds time limit of 3 minutes',
      error_code: 400
    }
  }

  // Create valid question
  const questionId: number = quiz.totalQuestions;
  quiz.totalQuestions++;

  const timestamp: number = Math.floor(Date.now() / 1000);

  // Add new quiz to store
  const newQuestion: Question = {
    questionId: questionId,
    question: question,
    timeLimit: timeLimit,
    points: points,
    answerOptions: answerOptions
  }

  quiz.questions.push(newQuestion);

  // Update time modified
  quiz.timeLastEdited = timestamp;

  // Update Data after Done
  updateData(store);

  return { questionId };
}