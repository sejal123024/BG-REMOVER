// Test script for n8n webhook connection
const testWebhook = async () => {
  const WEBHOOK_URL = "https://sejalkumavat.app.n8n.cloud/webhook/bg-remover";
  
  // Create a small test image (1x1 pixel PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 1, 1);
  }
  
  try {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    console.log('Testing webhook with small test image...');
    console.log(`Image size: ${blob.size} bytes`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, image/*, */*',
      },
      body: blob
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType?.startsWith('image/')) {
      const resultBlob = await response.blob();
      console.log(`Received image: ${resultBlob.size} bytes, type: ${resultBlob.type}`);
    } else {
      const text = await response.text();
      console.log('Response text:', text);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Export for use in browser console
window.testWebhook = testWebhook;
console.log('Webhook test function loaded. Run testWebhook() to test the connection.');
