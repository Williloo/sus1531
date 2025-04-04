import {
  UserDetails,
  QuizDetails, AnswerOption,
  EmptyObject
} from './interface';

import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;
const server = `${url}:${port}`;

export function adminAuthRegister(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): { session: string } | number {
  const res = request('POST', `${server}/v1/admin/auth/register`, {
    json: { email, password, nameFirst, nameLast },
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminAuthLogin(
  email: string,
  password: string
): { session: string } | number {
  const res = request('POST', `${server}/v1/admin/auth/login`, {
    json: { email, password },
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminUserDetails(
  session: string
): { user: UserDetails } | number {
  const res = request('GET', `${server}/v1/admin/user/details`, {
    headers: { session },
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminUserDetailsUpdate(
  session: string, email: string,
  nameFirst: string, nameLast: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/user/details`, {
    headers: { session },
    json: { email, nameFirst, nameLast }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminUserPasswordUpdate(
  session: string,
  oldPassword: string, newPassword: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/user/password`, {
    headers: { session },
    json: { oldPassword, newPassword }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizList(
  session: string
): { quizzes: QuizDetails[] } | number {
  const res = request('GET', `${server}/v1/admin/quiz/list`, {
    headers: { session },
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizCreate(
  session: string,
  name: string, description: string
): { quizId: number } | number {
  const res = request('POST', `${server}/v1/admin/quiz`, {
    headers: { session },
    json: { name, description }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizDelete(
  session: string,
  quizId: number
): EmptyObject | number {
  const res = request('DELETE', `${server}/v1/admin/quiz/${quizId}`, {
    headers: { session },
    json: { quizId }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizInfo(
  session: string,
  quizId: number
): QuizDetails | number {
  const res = request('GET', `${server}/v1/admin/quiz/${quizId}`, {
    headers: { session },
    json: { quizId }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizNameUpdate(
  session: string,
  quizId: number,
  name: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/name`, {
    headers: { session },
    json: { name }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizDescriptionUpdate(
  session: string,
  quizId: number,
  description: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/description`, {
    headers: { session },
    json: { description }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function clear(
): EmptyObject | number {
  const res = request('DELETE', `${server}/v1/clear`);

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminAuthLogout(
  session: string
): EmptyObject | number {
  const res = request('POST', `${server}/v1/admin/auth/logout`, {
    headers: { session },
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuizTransfer(
  session: string,
  quizId: number,
  userEmail: string
): EmptyObject | number {
  const res = request('POST', `${server}/v1/admin/quiz/${quizId}/transfer`, {
    headers: { session },
    json: { userEmail }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuestionCreate(
  session: string,
  quizId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]

): { questionId: number } | number {
  const res = request('POST', `${server}/v1/admin/quiz/${quizId}/question`, {
    headers: { session },
    json: {
      question,
      timeLimit,
      points,
      answerOptions
    }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuestionSuggestion(
  session: string,
  quizId: number

): { question: string } | number {
  const res = request('GET', `${server}/v1/admin/quiz/${quizId}/question/suggestion`, {
    headers: { session }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuestionUpdat(
  session: string,
  quizId: number, questionId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { session },
    json: {
      questionBody: {
        question,
        timeLimit,
        points,
        answerOptions
      }
    }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuestionRemove(
  session: string,
  quizId: number, questionId: number
): { questionId: number } | number {
  const res = request('DELETE', `${server}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { session }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}

export function adminQuestionMove(
  session: string,
  quizId: number, questionId: number,
  newPosition: number

): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
    headers: { session },
    json: { newPosition }
  });

  const body = JSON.parse(res.body.toString());
  if ([400, 401, 403].includes(res.statusCode)) {
    expect(body).toStrictEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  expect(res.statusCode).toStrictEqual(200);
  return body;
}
