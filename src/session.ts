import { Data } from './dataStore';

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

export function pairUserIdSessionId(store: Data, userId: number, sessionId: string | string[]) {
  store.sessions.set(sessionId, userId);
}

export function getUserIdBySessionId(store: Data, sessionId: string | string[]): number {
  return store.sessions.get(sessionId);
}

export function getSessionByUserId(store: Data, userId: number): string | string[] {
  return [...store.sessions].find(([key, value]) => userId === value)[0];
}
