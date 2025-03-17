import {
    adminQuizRemove,
} from '../quiz.js';
import {
    adminAuthRegister,
} from '../auth.js';
import {
    adminQuizCreate,
} from '../quiz.js';
import {
    clear
} from '../other.js'
  
let userId;
let quizId;
beforeEach('Success Register', () =>{
    clear();
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
        'This quiz is for testing adminQuizRemove function'
    );
});

describe('tests for adminQuizRemove', () => {
    test('Invalid User', () => {
        expect(adminQuizRemove(userId + 1, quizId))
        .toStrictEqual({error: 'Not A Valid User'});
    })

    test('Invalid Quiz', () => {
        expect(adminQuizRemove(userId, quizId+1))
        .toStrictEqual({error: 'Not A Valid Quiz'});
    })
   
    test('Quiz ID Not Owned By Input User ID', () => {
        /**create another user ID to successfully create another quiz ID*/
        const newId = adminAuthRegister(
            'Haoyuuuzz@gmail.com', 
            'thisisagoodpassword2025',
            'Haoyu', 
            'Zhuang'
        );
        /*create a quiz with a user id that is different from the userId 
        that is about to be input in the adminQuizRemove function*/
        const anotherQuizId = adminQuizCreate(
            newId, 
            'test_quiz 2', 
            'This quiz is for testing if the quiz Id is owned by input userid'
        );
        expect(adminQuizRemove(userId, anotherQuizId))
        .toStrictEqual({error: 'Quiz Id not owned by this userId'});
    })

    test('successfully remove quiz', () => {
        expect(adminQuizRemove(userId, quizId)).toStrictEqual({});
    })
})