import request from 'sync-request-curl';

const token = 'hf_eFMnrBrAIcbPoRI' + 'anksxKeHeVeGkfihzrD';

const response = request(
  'POST', 'https://api-inference.huggingface.co/models/google/gemma-2-2b-it', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    json: {
      inputs: `
      Say hi to me!
      `
    }
  }
);

console.log(response);