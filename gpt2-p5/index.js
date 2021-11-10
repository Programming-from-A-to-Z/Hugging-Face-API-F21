import fetch from 'node-fetch';
import dotenv from 'dotenv';
import wordfilter from 'wordfilter';
import express from 'express';

const app = express();

// make all the files in 'public' available
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.post('/hugging', async (request, response) => {
  const data = request.body;
  console.log(`Receiving request: ${JSON.stringify(data)}`);
  const outputs = await queryHugging(data);
  // Assumes only one input prompt right now
  const results = outputs[0];
  results.status = 'success';
  // Filtering words server side
  if (wordfilter.blacklisted(results.generated_text)) {
    results.generated_text = 'This response was blocked by wordfilter.';
  }
  console.log(`Sending results: ${JSON.stringify(results)}`);
  response.json(results);
});

dotenv.config();

async function queryHugging(data) {
  const postData = {
    inputs: data.prompt,
    parameters: {
      return_full_text: true,
    },
    options: {
      use_gpu: false,
      use_cache: false,
      wait_for_model: true,
    },
  };

  const response = await fetch(
    // 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-125M',
    'https://api-inference.huggingface.co/models/gpt2',
    {
      headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}` },
      method: 'POST',
      body: JSON.stringify(postData),
    }
  );
  const result = await response.json();
  return result;
}
