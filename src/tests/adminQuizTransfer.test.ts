import {
    adminAuthRegister,
    adminAuthLogin,
    adminQuizCreate,
    adminQuizTransfer,
    adminQuizInfo,
    clear
  } from '../requests';
  
  describe('POST /v1/admin/quiz/{quizId}/transfer', () => {
    let sessionToken: string;
    let quizId: number;
  
    beforeEach(() => {
      clear();
  
      const registerResult = adminAuthRegister('user@example.com', 'password123', 'John', 'Doe');
      sessionToken = registerResult.session;
  
      const createQuizResult = adminQuizCreate(sessionToken, 'Sample Quiz', 'A description of my quiz');
      quizId = createQuizResult.quizId;
    });
  
    describe('Success cases', () => {
        //TO DO: find method to check ownership of quiz
      test('Successfully transfers quiz ownership to another user', () => {
        const res = adminQuizTransfer(sessionToken, quizId, 'yuchao@unsw.edu.au' );
        expect(res).toStrictEqual({});
      });
    });
  
    describe('Error cases', () => {
      test('Error when session is empty', () => {
        const res = adminQuizTransfer('', quizId, { userEmail: 'yuchao@unsw.edu.au' });
        expect(res).toStrictEqual(401);
      });
  
      test('Error when session is invalid', () => {
        const res = adminQuizTransfer('invalid-session-token', quizId, { userEmail: 'yuchao@unsw.edu.au' });
        expect(res).toStrictEqual(401);
      });
  
      test('Error if userEmail is not a real user', () => {
        const res = adminQuizTransfer(sessionToken, quizId, { userEmail: 'nonexistent@domain.com' });
        expect(res).toStrictEqual(400);
      });
  
      test('Error if userEmail is the current logged-in user', () => {
        const res = adminQuizTransfer(sessionToken, quizId, { userEmail: 'user@example.com' });
        expect(res).toStrictEqual(400);
      });
  
      test('Error if quiz name is already used by target user', () => {
        adminQuizTransfer(sessionToken, quizId, { userEmail: 'yuchao@unsw.edu.au' });
  
        // Attempt to transfer quiz again to the same user
        const res = adminQuizTransfer(sessionToken, quizId, { userEmail: 'yuchao@unsw.edu.au' });
        expect(res).toStrictEqual(400);
      });
  
      test('Error if the user is not the quiz owner or quiz does not exist', () => {
        const registerResult = adminAuthRegister('anotheruser@example.com', 'password456', 'Jane', 'Doe');
        const sessionToken2 = registerResult.session;
  
        const res = adminQuizTransfer(sessionToken2, quizId, { userEmail: 'yuchao@unsw.edu.au' });
        expect(res).toStrictEqual(403);
      });
    });
  });
  