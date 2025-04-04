import {
    adminAuthRegister,
    adminAuthLogin,
    adminQuizCreate,
    adminQuizTransfer,
    adminQuizInfo,
    adminQuizRemove,
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
      test('Successfully transfers quiz ownership to another user', () => {
        const registerResult2 = adminAuthRegister('yuchao@unsw.edu.au', 'goodpassword123', 'Yu', 'Chao');
        const sessionToken2 = registerResult2.session;

        const res = adminQuizTransfer(sessionToken, quizId, 'yuchao@unsw.edu.au' );
        expect(res).toStrictEqual({});

        expect(adminQuizInfo(sessionToken, quizId)).toStrictEqual(403);

        expect(adminQuizInfo(sessionToken2, quizId)).toStrictEqual({
          quizId: quizId,
          name: 'Sample Quiz',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'A description of my quiz',
          numQuestions: 0,
          questions: [],
          timeimit: 0
        });
      });
    });
  
    describe('Error cases', () => {
      test('Error when session is empty', () => {
        const registerResult2 = adminAuthRegister('yuchao@unsw.edu.au', 'goodpassword123', 'Yu', 'Chao');
        const res = adminQuizTransfer('', quizId, 'yuchao@unsw.edu.au');
        expect(res).toStrictEqual(401);
      });
  
      test('Error when session is invalid', () => {
        const registerResult2 = adminAuthRegister('yuchao@unsw.edu.au', 'goodpassword123', 'Yu', 'Chao');
        const res = adminQuizTransfer('invalid-session-token', quizId, 'yuchao@unsw.edu.au');
        expect(res).toStrictEqual(401);
      });
  
      test('Error if userEmail is not a real user', () => {
        const res = adminQuizTransfer(sessionToken, quizId, 'nonexistent@domain.com');
        expect(res).toStrictEqual(400);
      });
  
      test('Error if userEmail is the current logged-in user', () => {
        const res = adminQuizTransfer(sessionToken, quizId, 'user@example.com');
        expect(res).toStrictEqual(400);
      });
  
      test('Error if quiz name is already used by target user', () => {
        const registerResult2 = adminAuthRegister('yuchao@unsw.edu.au', 'goodpassword123', 'Yu', 'Chao');
        adminQuizTransfer(sessionToken, quizId,'yuchao@unsw.edu.au');
  
        // Attempt to transfer quiz again to the same user
        const res = adminQuizTransfer(sessionToken, quizId, 'yuchao@unsw.edu.au');
        expect(res).toStrictEqual(400);
      });
  
      test('Error if the user is not the quiz owner', () => {
        const registerResult2 = adminAuthRegister('anotheruser@example.com', 'password456', 'Jane', 'Doe');
        const sessionToken2 = registerResult2.session;

        const createQuizResult2 = adminQuizCreate(sessionToken2, 'Another Quiz', 'A description of another quiz');
        const quizId2 = createQuizResult2.quizId;

        const res = adminQuizTransfer(sessionToken, quizId2, 'user@example.com');
        expect(res).toStrictEqual(403);
      });

      test('Error if the quiz does not exist', () => {
        const registerResult2 = adminAuthRegister('anotheruser@example.com', 'password456', 'Jane', 'Doe');
        //Remove the quiz, now quiz does not exist
        adminQuizRemove(sessionToken, quizId);
        const res = adminQuizTransfer(sessionToken, quizId, 'anotheruser@example.com');
        expect(res).toStrictEqual(403);
      });
    });
  });
  