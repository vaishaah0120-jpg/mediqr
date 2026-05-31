// Using Node 22 built-in global fetch

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🏁 Starting E2E Verification Tests (Phase 4)...');

  // 1. Login as Receptionist
  console.log('\n🔑 1. Logging in as Receptionist...');
  const recepLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'receptionist@mediqr.com', password: 'RecepPass123', role: 'receptionist' })
  });
  const recepData = await recepLogin.json();
  if (!recepData.success) {
    console.error('❌ Login failed:', recepData);
    return;
  }
  const token = recepData.token;
  console.log('✅ Receptionist logged in! Token acquired.');

  // 2. Create a patient
  console.log('\n➕ 2. Creating a new patient...');
  const patientPayload = {
    fullName: 'Peter Parker',
    age: 17,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+15550088',
    address: '20 Ingram St, Queens',
    emergencyContact: {
      name: 'May Parker',
      phone: '+15550089',
      relation: 'Aunt'
    }
  };
  
  const addPatient = await fetch(`${baseUrl}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(patientPayload)
  });
  
  const addPatientData = await addPatient.json();
  console.log('✅ Patient created status:', addPatientData.success);
  console.log('Generated patientId:', addPatientData.data?.patientId);
  const patientIdDb = addPatientData.data?._id;
  console.log('Database ObjectId:', patientIdDb);

  // 3. Query QR Endpoint
  console.log(`\n📷 3. Querying QR Code API endpoint (/patients/${patientIdDb}/qr)...`);
  const getQr = await fetch(`${baseUrl}/patients/${patientIdDb}/qr`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const qrData = await getQr.json();
  console.log('✅ API response status:', getQr.status);
  console.log('API response body success:', qrData.success);
  console.log('Patient ID returned from API:', qrData.patientId);
  console.log('Base64 QR image snippet:', qrData.qrCode ? qrData.qrCode.substring(0, 50) + '...' : 'None');
  console.log('Total base64 characters length:', qrData.qrCode ? qrData.qrCode.length : 0);

  console.log('\n🎉 E2E Tests Complete!');
}

runTests();
