import {
  Data, EmptyObject, Error
} from './interface';

import {
  updateData
} from './dataStore';

export function createSessionId(store: Data, userId: number): string {
  let sessionId;
  while (true) {
    sessionId = Math.random().toString(36).substr(2, 7).toString();
    if (!(store.sessions.has(sessionId))) {
      break;
    }
  }

  pairUserIdSessionId(store, userId, sessionId);
  updateData(store);
  return sessionId;
}

function pairUserIdSessionId(
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
  for (const [key, value] of store.sessions.entries()) {
    if (value === userId) {
      return key;
    }
  }
}

export function checkValidSessionId(
  store: Data, sessionId: string | string[]
): Error | EmptyObject {
  if (typeof sessionId === 'string' && sessionId.length === 0) {
    return {
      error_msg: 'Session is empty or invalid',
      error_code: 401
    };
  } else if (typeof store.sessions.get(sessionId) === 'undefined') {
    return {
      error_msg: 'Session is empty or invalid',
      error_code: 401
    };
  }

  return { };
}
