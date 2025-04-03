import {
  Data
} from './interface';

import fs from 'fs';

const defaultData: Data = {
  users: [],
  usersCreated: 0,
  quizzes: [],
  quizCreated: 0
};

const storedDataString: string = fs.readFileSync('src/store.json').toString();
if (storedDataString === '') {
  fs.writeFileSync('src/store.json', JSON.stringify(defaultData));
}

const data: Data = JSON.parse(fs.readFileSync('src/store.json').toString());

function getData(): Data {
  return data;
}

function updateData(store: Data): void {
  fs.writeFileSync('src/store.json', JSON.stringify(store));
}

export { getData, updateData };
