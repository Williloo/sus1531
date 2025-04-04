import {
  Data, EmptyObject, Error
} from './interface';

import {
  updateData
} from './dataStore'

export function createSessionId(store: Data): string {
  let sessionId;
  while (true) {
    sessionId = Math.random().toString(36).substr(2, 7);
    if (!(store.sessions.has(sessionId))) {
      break;
    }
  }

  return sessionId;
}

export function pairUserIdSessionId(
  store: Data, userId: number, sessionId: string | string[]
) {
  store.sessions.set(sessionId, userId);
  updateData(store);
}

export function deleteSession(
  store: Data
) {
  store.sessions = new Map();
  updateData(store);
}

export function getUserIdBySessionId(store: Data, sessionId: string | string[]): number {
  return store.sessions.get(sessionId);
}

export function getSessionByUserId(store: Data, userId: number): string | string[] {
  return [...store.sessions].find(([key, value]) => userId === value)[0];
}

export function checkValidSessionId(
  store: Data, sessionId: string | string[]
): Error | EmptyObject {
  if (typeof sessionId === 'string' && sessionId.length === 0) {
    return {
      error_msg: 'Session is empty or invalid',
      error_code: 401
    };
  } else if (!(store.sessions.get(sessionId))) {
    return {
      error_msg: 'Session is empty or invalid',
      error_code: 401
    };
  }

  return { };
}
