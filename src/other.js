/**
 * The function reset the state of the application back to the start
 *
 * @returns { Object } - Empty object
*/

import { getData } from './dataStore.js';

export function clear(  ) {
  
  let data = getData();
  data = {
    users: [],
    quizzes: []
  }

  return {  }
}