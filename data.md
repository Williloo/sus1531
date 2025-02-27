```javascript


/*  Data: {
      users: {
        Array<{
          user: {
            userId: number,
            nameFirst: string,
            nameLast: string,
            email: string,
            numSuccessfulLogins: number,
            numFailedPasswordsSinceLastLogin : number
          }
        }>
      },

      quizzes: {
        Array<{
          quiz: {
            quizId: number,
            creatorId: number, 
            name: string,
            timeCreated: number,
            timeLastEdited: number,
            description: string,
          }
        }>
      }
    }
*/

let Data = {
  users: [
    user: {
      userId: 1,
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      email: 'hayden.smith@unsw.edu.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin : 2
    }
  ],
  quizzes: [
    quiz: {
    {
      quizId: 1,
      creatorId: 1, 
      name: 'My Quiz',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'This is my quiz',
    }
    },
  ]
}
```
Our data structure is one nested Data object seperated into two nested objects keys; users and quizzes. The users objects key 
is an array of user objects containing all the relevant data with the quizzes object following the same convention.
