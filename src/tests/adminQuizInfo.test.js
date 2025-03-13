import {
    adminQuizInfo,
} from '../quiz.js';
import {
    adminAuthRegister,
} from '../auth.js';
import {
    adminQuizCreate,
} from '../quiz.js';

let userId;
let quizId;
beforeEach('Success Register', () =>{
    /*Used Input from adminAuthRegister.test.js to ensure a successfull return*/
    userId = adminAuthRegister(
        'jpozzolungo@gmail.com', 
        'thisisagoodpassword1974',
        'Joshua', 
        'Pozzolungo'
    );
    quizId = adminQuizCreate(
        userId, 
        'test_quiz', 
        'This quiz is for testing adminQuizInfo function'
    );
});

describe('tests for adminQuizInfo', () => {
    test('Invalid User', () => {
        expect(adminQuizInfo(userId + 1, quizId))
        .toStrictEqual({error: 'Not A Valid User'});
    })

    test('Invalid Quiz', () => {
        expect(adminQuizInfo(userId, quizId+1))
        .toStrictEqual({error: 'Not A Valid Quiz'});
    })
   
    test('Quiz ID Not Owned By Input User ID', () => {
        /*create a quiz with a user id that is different from the userId 
        that is about to be input in the adminQuizInfo function*/
        const anotherQuizId = adminQuizCreate(
            userId + 1, 
            'test_quiz', 
            'This quiz is for testing adminQuizInfo function'
        );
        expect(adminQuizInfo(userId, anotherQuizId))
        .toStrictEqual({error: 'Quiz Id not owned by this userId'});
    })
})