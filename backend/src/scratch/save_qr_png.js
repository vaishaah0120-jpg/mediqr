import fs from 'fs';
import path from 'path';

async function generateQrImage() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('Fetching receptionist login...');
  
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'receptionist@mediqr.com', password: 'RecepPass123', role: 'receptionist' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('Fetching QR Code data...');
  const qrRes = await fetch(`${baseUrl}/patients/60c72b2f9b1d8a23d45678a1/qr`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const qrData = await qrRes.json();
  
  if (qrData.success && qrData.qrCode) {
    const base64Data = qrData.qrCode.replace(/^data:image\/png;base64,/, "");
    const outputPath = path.join('src', 'scratch', 'james_carter_qr.png');
    fs.writeFileSync(outputPath, base64Data, 'base64');
    console.log(`✅ Saved QR Code PNG to: ${outputPath}`);
  } else {
    console.error('❌ Failed to retrieve QR code:', qrData);
  }
}

generateQrImage();
