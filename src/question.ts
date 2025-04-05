import {
  getData, updateData,
} from './dataStore';

import {
  Data, Quiz, Question, AnswerOption, Error, EmptyObject
} from './interface';

import {
  checkUserExists,
  checkQuestionName,
  findQuiz,
  findQuestion,
  checkQuestionProperties,
  getTimeLimit
} from './helpers';

import request from 'sync-request-curl';

const token1 = 'hf_eFMnrBrAIcbPoRI';
const token2 = 'anksxKeHeVeGkfihzrD';
const token = token1 + token2;

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
    };
  }

  // Check if timeLimits run over
  const time: number = timeLimit + getTimeLimit(quiz);

  if (time > 3 * 60) {
    return {
      error_msg: 'quiz exceeds time limit of 3 minutes',
      error_code: 400
    };
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
    answerOptions: [],
    totalAnswers: 0
  };

  const colours: string[] = [
    'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'
  ];
  let counter = 0;

  for (const answerOption of answerOptions) {
    answerOption.answerId = newQuestion.totalAnswers;
    newQuestion.totalAnswers++;

    answerOption.colour = colours[counter];
    counter++;
    newQuestion.answerOptions.push(answerOption);
  }

  quiz.questions.push(newQuestion);

  // Update time modified
  quiz.timeLastEdited = timestamp;

  // Update Data after Done
  updateData(store);

  return { questionId };
}

export function adminQuestionSuggestion(
  quizId: number, userId: number
): Error | { question: string } {
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

  const response = request(
    'POST', 'https://api-inference.huggingface.co/models/google/gemma-2-2b-it', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: {
        inputs: `
        Given the following quiz name and description, generate a multiple-choice quiz question that
        adheres to these strict rules:
        The question must be between 5 and 50 characters long.
        The length must never exceed 50 characters.

        The question must be suitable for a multiple-choice quiz.
        DO NOT include answer options—only output the question itself.

        Quiz Name: ${quiz.name}
        Quiz Description: ${quiz.description}

        Output only the question, nothing else.
        `
      }
    }
  );

  const q:string = JSON.parse(response.body.toString())[0].generated_text;
  const text = q.trim().split('\n')[q.trim().split('\n').length - 1];

  return { question: text };
}

export function adminQuestionUpdate(
  quizId: number, questionId: number, userId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]
): Error | EmptyObject {
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

  // Check if question and answers are valid
  if (!checkQuestionProperties(
    answerOptions, timeLimit, points
  )) {
    return {
      error_msg: 'invalid question or answer',
      error_code: 400
    };
  }

  // Check if timeLimits run over
  const time: number = timeLimit + getTimeLimit(quiz);

  if (time > 3 * 60) {
    return {
      error_msg: 'quiz exceeds time limit of 3 minutes',
      error_code: 400
    };
  }

  // Create valid question
  const questionUpdate: null | Question = findQuestion(questionId, quiz.questions);

  const timestamp: number = Math.floor(Date.now() / 1000);

  // Add new quiz to store
  questionUpdate.questionId = questionId;
  questionUpdate.question = question;
  questionUpdate.timeLimit = timeLimit;
  questionUpdate.points = points;
  questionUpdate.answerOptions = [];
  questionUpdate.totalAnswers = 0;

  const colours: string[] = [
    'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'
  ];
  let counter = 0;

  for (const answerOption of answerOptions) {
    answerOption.answerId = questionUpdate.totalAnswers;
    questionUpdate.totalAnswers++;

    answerOption.colour = colours[counter];
    counter++;
    questionUpdate.answerOptions.push(answerOption);
  }

  // Update time modified
  quiz.timeLastEdited = timestamp;

  // Update Data after Done
  updateData(store);

  return { questionId };
}

export function adminQuestionRemove(
  quizId: number, questionId: number,
  userId: number
): Error | EmptyObject {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'Not A Valid User',
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

  // Check if question exists
  const questionRemove: null | Question = findQuestion(questionId, quiz.questions);
  if (!questionRemove) {
    return {
      error_msg: 'question does not exist',
      error_code: 400
    };
  }

  // Find index of question and remove from data
  const index: number = quiz.questions.findIndex(
    question => question.questionId === questionId
  );
  quiz.questions.splice(index, 1);

  // Update Data after Done
  updateData(store);

  return {};
}

export function adminQuestionMove(
  quizId: number, questionId: number,
  userId: number, newPos: number
): Error | EmptyObject {
  const store: Data = getData();

  // Check if valid userId
  if (!checkUserExists(userId, store.users)) {
    return {
      error_msg: 'Not A Valid User',
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

  // Check if question exists
  const questionMove: null | Question = findQuestion(questionId, quiz.questions);
  if (!questionMove) {
    return {
      error_msg: 'question does not exist',
      error_code: 400
    };
  }

  // Check if valid position
  if (newPos < 0 || newPos >= quiz.questions.length) {
    return {
      error_msg: 'invalid new position',
      error_code: 400
    };
  }

  if (newPos === questionMove.questionId) {
    return {
      error_msg: 'invalid new position',
      error_code: 400
    };
  }

  // Find present index
  const index: number = quiz.questions.findIndex(
    questions => questions.questionId === questionMove.questionId
  );

  // Rearrnge array
  const [removedElement] = quiz.questions.splice(index, 1);
  quiz.questions.splice(newPos, 0, removedElement);

  // Update data
  updateData(store);

  return {};
}
