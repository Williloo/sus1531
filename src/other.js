import { getData } from './dataStore.js'

/**
 * The function reset the state of the application back to the start
 *
 * @returns { Object } - Empty object
*/
export function clear(  ) {
  let store = getData()

  // Remove all users
  while (store.users.length != 0) {
    store.users.pop()
  }

  // Remove all quizzes
  while (store.quizzes.length != 0) {
    store.quizzes.pop()
  }

  return {  }
}