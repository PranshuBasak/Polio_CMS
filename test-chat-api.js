
async function testChatApi() {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    console.log('Status:', response.status);
    
    if (response.status !== 200) {
        console.error('Error Body:', await response.text());
        return;
    }

    // Check if it's a stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log('Received chunk:', decoder.decode(value));
      break; // Just need one chunk to verify stream started
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testChatApi();
