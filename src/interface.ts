export interface User {
  userId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  password: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  pastPasswords: string[]
}

export interface Quiz {
  quizId: number,
  creatorId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  questions: Question[],
  totalQuestions: number
}

export interface Data {
  users: User[],
  usersCreated: number,
  quizzes: Quiz[],
  quizCreated: number
}

export interface Error {
  error_msg: string,
  error_code: number
}

export interface UserDetails {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number,
  }
}

export interface QuizDetails {
  quizId: number,
  name: string,
  timeCreated?: number,
  timeLastEdited?: number,
  description?: string,
  numQuestions?: number,
  questions?: Question[],
  timeLimit?: number
}

export interface Question {
  questionId: number,
  question: string,
  timeLimit: number,
  points: number,
  answerOptions: AnswerOption[],
  totalAnswers?: number
}

export interface AnswerOption {
  answerId?: number,
  answer: string,
  colour?: string,
  correct: boolean,
}

export type EmptyObject = Record<never, never>;
