// YOU MAY MODIFY THIS OBJECT BELOW
export interface User {
  userId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  password: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
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
  quizzes: Quiz[]
};
  
// YOU MAY MODIFY THIS OBJECT ABOVE
const data: Data = {
  users: [],
  quizzes: []
}

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
  