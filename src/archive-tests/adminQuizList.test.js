// import {
//   adminQuizList,
//   adminQuizCreate,
// } from '../quiz';

// import {
//   adminAuthRegister
// } from '../auth';

// import {
//   clear
// } from '../other';

// let userId;
// describe('tests for adminQuizList', () => {
//   beforeEach(() => {
//     clear();
//     userId = adminAuthRegister('validemail@gmail.com', 'Password123', 'Yash', 'Mittal').userId;
//   });

//   describe('error_msg cases', () => {
//     test('invalid userId', () => {
//       expect(adminQuizList(-1)).toStrictEqual(
//         { error_msg: expect.any(String) }
//       );
//     });
//   });

//   describe('success cases', () => {
//     test('valid user with no quizzes', () => {
//       expect(adminQuizList(userId)).toStrictEqual(
//         { quizzes: [] }
//       );
//     });

//     test('valid user with quizzes', () => {
//       adminQuizCreate(userId, 'Quiz 1', '');
//       adminQuizCreate(userId, 'Quiz 2', '');

//       expect(adminQuizList(userId)).toStrictEqual(
//         {
//           quizzes: [
//             { quizId: expect.any(Number), name: 'Quiz 1' },
//             { quizId: expect.any(Number), name: 'Quiz 2' },
//           ]
//         }
//       );
//     });
//   });
// });
