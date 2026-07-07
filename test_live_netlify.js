const fetch = require('node-fetch'); // we use node-fetch locally

async function testUrl(url) {
  console.log("Testing:", url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payer: { email: "test@test.com" },
        transaction_amount: 10
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text.substring(0, 500));
  } catch(e) {
    console.error("Network Error:", e);
  }
}

async function run() {
  await testUrl('https://editoravivalyrio.com.br/.netlify/functions/process_payment');
  console.log("---");
  await testUrl('https://6a40658259622841bcb8c3fb--fanciful-choux-a08cc6.netlify.app/.netlify/functions/process_payment');
}
run();
