let promptInput;

function setup() {
  noCanvas();
  promptInput = createInput('The weather today');
  let generateButton = createButton('generate');
  generateButton.mousePressed(sendText);
}

async function sendText() {
  const inputs = {
    prompt: promptInput.value(),
  };
  console.log(inputs);
  const data = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  };
  const response = await fetch('hugging', data);
  const outputs = await response.json();

  createP(outputs.generated_text);
}
