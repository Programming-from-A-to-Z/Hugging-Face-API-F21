import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function query(data) {
  const response = await fetch(
    // 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-125M',
    'https://api-inference.huggingface.co/models/gpt2',
    {
      headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}` },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

go();

async function go() {
  const data = {
    inputs: 'The Interactive Telecommunications Program is',
    parameters: {
      max_length: 50,
      return_full_text: true,
    },
    options: {
      use_gpu: false,
      use_cache: false,
      wait_for_model: true,
    },
  };
  const result = await query(data);
  console.log(result[0].generated_text);
}
