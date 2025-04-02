import {
  getData,
  Data, EmptyObject
} from './dataStore';

/**
 * The function reset the state of the application back to the start
 *
 * @returns { Object } - Empty object
*/
export function clear(): EmptyObject {
  const store: Data = getData();

  // Remove all users
  while (store.users.length !== 0) {
    store.users.pop();
  }

  // Remove all quizzes
  while (store.quizzes.length !== 0) {
    store.quizzes.pop();
  }

  // Reset quiz and user created values to 0
  store.quizCreated = 0;
  store.usersCreated = 0;

  return {};
}
