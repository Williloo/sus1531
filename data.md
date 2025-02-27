```javascript
/* Array<{
    user: {
      userId: number,
      nameFirst: string,
      nameLast: string,
      email: string,
      numSuccessfulLogins: number
    }
  }>
*/

let users = [
  { user:
    {
      userId: 1,
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      email: 'hayden.smith@unsw.edu.au',
      numSuccessfulLogins: 3
    }
  },
]

let quizzes = [
  { quiz:   
    {
      quizId: 1,
      name: 'My Quiz',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'This is my quiz',
    }
  }
]
```

An array of nested objects for users and quizzes. Each index of these arrays will contain a nested object with the
key being the actual user/quiz and then its value being an object containing all the relevant information. 

