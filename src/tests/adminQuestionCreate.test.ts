describe('tests for adminQuestionCreate', () => {
  describe('success cases', () => {
    test('create one question', () => {

    });

    test('create multiple questions for same user', () => {

    });

    test('create multiple questions for different users, so total time limit greater than 3 minutes', () => {

    });
  });

  describe('error cases', () => {
    test('empty session', () => {

    });

    test('invalid session', () => {

    });

    test('quiz doesn\'t exist', () => {

    });

    test('quiz isn\'t owned by user', () => {

    });

    test('question less than 5 characters', () => {

    });

    test('question more than 50 characters', () => {

    });

    test('question has 0 answers', () => {

    });

    test('question has 1 answer', () => {

    });

    test('question has 7 answers', () => {

    });

    test('question timelimt is 0', () => {

    });

    test('question timelimit is negative', () => {

    });

    test('1 question timelimit exceed 3 minutes', () => {

    });

    test('adding nth question timelimit exceeds 3 minutes', () => {

    });

    test('points awarded is 0', () => {

    });

    test('points awarded is negative', () => {

    });

    test('points awarded greater than 10', () => {

    });

    test('length of an answer less than 1 character', () => {

    });

    test('length of an answer more than 10 characters', () => {

    });

    test('duplicate answers', () => {

    });

    test('no correct answers', () => {

    });
  })
});
