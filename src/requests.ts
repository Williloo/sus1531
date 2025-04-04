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
): { sessionId: string } | number {
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
): { sessionId: string } | number {
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
  sessionId: string
): { user: UserDetails } | number {
  const res = request('GET', `${server}/v1/admin/user/details`, {
    headers: { sessionId },
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
  sessionId: string, email: string,
  nameFirst: string, nameLast: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/user/details`, {
    headers: { sessionId },
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
  sessionId: string,
  oldPassword: string, newPassword: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/user/password`, {
    headers: { sessionId },
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
  sessionId: string
): QuizDetails[] | number {
  const res = request('GET', `${server}/v1/admin/quiz/list`, {
    headers: { sessionId },
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
  sessionId: string,
  name: string, description: string
): { quizId: number } | number {
  const res = request('POST', `${server}/v1/admin/quiz`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number
): EmptyObject | number {
  const res = request('DELETE', `${server}/v1/admin/quiz/${quizId}`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number
): QuizDetails | number {
  const res = request('GET', `${server}/v1/admin/quiz/${quizId}`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number,
  name: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/name`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number,
  description: string
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/description`, {
    headers: { sessionId },
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
  sessionId: string
): EmptyObject | number {
  const res = request('POST', `${server}/v1/admin/auth/logout`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number,
  userEmail: string
): EmptyObject | number {
  const res = request('POST', `${server}/v1/admin/quiz/${quizId}/transfer`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]

): { questionId: number } | number {
  const res = request('POST', `${server}/v1/admin/quiz/${quizId}/description`, {
    headers: { sessionId },
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

export function adminQuestionSuggestion(
  sessionId: string,
  quizId: number

): { question: string } | number {
  const res = request('GET', `${server}/v1/admin/quiz/${quizId}/question/suggestion`, {
    headers: { sessionId }
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
  sessionId: string,
  quizId: number, questionId: number,
  question: string, timeLimit: number,
  points: number, answerOptions: AnswerOption[]
): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { sessionId },
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
  sessionId: string,
  quizId: number, questionId: number
): { questionId: number } | number {
  const res = request('DELETE', `${server}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { sessionId }
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
  sessionId: string,
  quizId: number, questionId: number,
  newPosition: number

): EmptyObject | number {
  const res = request('PUT', `${server}/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
    headers: { sessionId },
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
