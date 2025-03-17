import {
    adminQuizInfo,
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
beforeEach(() =>{
    clear();
    /*Used Input from adminAuthRegister.test.js to ensure a successfull return*/
    userId = adminAuthRegister(
        'jpozzolungo@gmail.com', 
        'thisisagoodpassword1974',
        'Joshua', 
        'Pozzolungo'
    ).userId;
    quizId = adminQuizCreate(
        userId, 
        'test quiz', 
        'This quiz is for testing adminQuizInfo function'
    ).quizId;
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
        /**create another user ID to successfully create another quiz ID*/
        const newId = adminAuthRegister(
            'Haoyuuuzz@gmail.com', 
            'thisisagoodpassword2025',
            'Haoyu', 
            'Zhuang'
        ).userId;
        /*create a quiz with a user id that is different from the userId 
        that is about to be input in the adminQuizInfo function*/
        const anotherQuizId = adminQuizCreate(
            newId, 
            'test quiz 2', 
            'This quiz is for testing if the quiz Id is owned by input userid'
        ).quizId;

        expect(adminQuizInfo(userId, anotherQuizId))
        .toStrictEqual({error: 'Quiz Id not owned by this userId'});
    })

    test('Successful case', () => {
        expect(adminQuizInfo(userId,quizId)).toStrictEqual(
            {
                quizId: quizId,
                name:'test quiz',
                timeCreated: expect.any(Number),
                timeLastEdited: expect.any(Number),
                description: 'This quiz is for testing adminQuizInfo function'
            }
        )
    })
})