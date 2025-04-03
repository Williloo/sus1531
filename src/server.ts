import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import request from 'sync-request-curl';

import { adminAuthRegister, 
         adminAuthLogin,
         adminUserDetails,
         adminUserDetailsUpdate,
         adminUserPasswordUpdate } from './auth'

import { adminQuizList,
         adminQuizCreate,
         adminQuizRemove,
         adminQuizInfo,
         adminQuizNameUpdate,
         adminQuizDescriptionUpdate } from './quiz'

import {  getUserIdBySessionId,
          getSessionByUserId } from './session'
import { clear } from './other'
import { getData } from './dataStore'


const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const result = echo(req.query.echo as string);
  if ('error' in result) {
    res.status(400);
  }

  return res.json(result);
});


app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const userId = adminAuthRegister(email, password, nameFirst, nameLast);
  const store = getData();

  if ("error_msg" in userId) {
    res.status(400).json(userId);
    return;
  }

  const sessionId = getSessionByUserId(store, userId.userId);

  res.status(200).json(sessionId);
})

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userId = adminAuthLogin(email, password);
  const store = getData();

  if ("error_msg" in userId) {
    res.status(400).json(userId);
    return;
  }

  const sessionId = getSessionByUserId(store, userId.userId);
  res.status(200).json(userId);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const details = adminUserDetails(userId);

  if ("error_msg" in details) {
    res.status(400).json(userId);
    return;
  }

  res.status(200).json(details);
})


app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const { email, nameFirst, nameLast } = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminUserDetailsUpdate(userId, email, nameFirst, nameLast);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else {
      res.status(401).json(result);
    }
  }

  res.status(200).json(result);
})

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const { oldPassword, newPassword } = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId)
  
  const result = adminUserPasswordUpdate(userId, oldPassword, newPassword);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else {
      res.status(401).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizList(userId);

  if ("error_msg" in result) {
    res.status(401).json(result);
  }
  else {
    res.status(200).json(result);
  }

  res.status(200).json(result)
})

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const { name, description } = req.body;

  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizCreate(userId, name, description);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else {
      res.status(401).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);

  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizRemove(userId, quizId);

  if ("error_msg" in result) {
    if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizInfo(userId, quizId);

  if ("error_msg" in result) {
    if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);

})

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const { name } = req.body;

  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizNameUpdate(userId, quizId, name);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401){
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);

})

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const { description } = req.body;

  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizDescriptionUpdate(userId, quizId, description);
  
  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.delete('/v1/clear', (req: Request, res: Response) => {
  const result = clear();
  res.status(200).json(result);
})

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminAuthLogout();

  if ("error_msg" in result) {
    res.status(401).json(result);
    return;
  }

  res.status(200).json(result);
})



app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const { userEmail } = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuizTransfer(quizId, userId, userEmail);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const {question, timeLimit, points, answerOptions} = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuestionCreate(userId, quizId, question, timeLimit, points, answerOptions);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);

})

app.get('/v1/admin/quiz/:quizid/question/suggestion', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuestionSuggestion(quizId, userId);

  if ("error_msg" in result) {
    if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);
  const {question, timeLimit, points, answerOptions} = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuestionUpdate(quizId, questionId, userId, question,
                                     timeLimit, points, answerOptions);
  
  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);
})

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const sessionId = req.headers.session;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string); 
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuestionRemove(quizId, questionId, userId);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);

})

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const sessionId = req.headers.session as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string); 
  const { newPosition } = req.body;
  const store = getData();
  const userId = getUserIdBySessionId(store, sessionId);
  const result = adminQuestionMove(quizId, questionId, userId, newPosition);

  if ("error_msg" in result) {
    if (result.error_code === 400) {
      res.status(400).json(result);
    }
    else if (result.error_code === 401) {
      res.status(401).json(result);
    }
    else {
      res.status(403).json(result);
    }
    return;
  }

  res.status(200).json(result);

})


// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});


