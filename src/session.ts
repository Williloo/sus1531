import {
    getData, updateData,
    Data, User, Error, UserDetails, EmptyObject
  } from './dataStore';


export function createSessionId(): string {
  
    return Math.random().toString(36).substr(2); 
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