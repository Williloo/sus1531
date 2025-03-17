import { getData } from './dataStore.js';

/**
 * The function reset the state of the application back to the start
 *
 * @returns { Object } - Empty object
*/
export function clear(  ) {
  let data = getData();
  while (data.users.length != 0) {
    data.users.pop()
  }

  while (data.quizzes.length != 0) {
    data.quizzes.pop()
  }

  return {  }
}