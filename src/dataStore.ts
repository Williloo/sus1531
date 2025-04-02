// YOU MAY MODIFY THIS OBJECT BELOW
export interface User {
  userId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  password: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  pastPasswords: string[]
}

export interface Quiz {
  quizId: number,
  creatorId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
}

export interface Data {
  users: User[],
  usersCreated: number,
  quizzes: Quiz[],
  quizCreated: number
}

export interface Error {
  error_msg: string
}

export interface Session {
  userId: number
}

export interface UserDetails {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number,
  }
}

export interface QuizDetails {
  quizId: number,
  name: string,
  timeCreated?: number,
  timeLastEdited?: number,
  description?: string
}

export type EmptyObject = Record<never, never>;

// YOU MAY MODIFY THIS OBJECT ABOVE
const data: Data = {
  users: [],
  usersCreated: 0,
  quizzes: [],
  quizCreated: 0
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
  let store = getData()
  console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

  store.names.pop() // Removes the last name from the names array
  store.names.push('Jake') // Adds 'Jake' to the end of the names array

  console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
*/

// Use getData() to access the data
function getData(): Data {
  return data;
}

export { getData };
