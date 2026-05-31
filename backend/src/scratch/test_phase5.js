// Using Node 22 built-in global fetch
async function runPhase5Tests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🏁 Starting E2E Verification Tests (Phase 5)...');

  // 1. Login as Receptionist
  console.log('\n🔑 1. Logging in as Receptionist...');
  const recepLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'receptionist@mediqr.com', password: 'RecepPass123', role: 'receptionist' })
  });
  const recepData = await recepLogin.json();
  if (!recepData.success) {
    console.error('❌ Receptionist Login failed:', recepData);
    return;
  }
  const recepToken = recepData.token;
  console.log('✅ Receptionist logged in! Token acquired.');

  // 2. Login as Doctor
  console.log('\n🔑 2. Logging in as Doctor...');
  const docLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'doctor@mediqr.com', password: 'DoctorPass123', role: 'doctor' })
  });
  const docData = await docLogin.json();
  if (!docData.success) {
    console.error('❌ Doctor Login failed:', docData);
    return;
  }
  const docToken = docData.token;
  console.log('✅ Doctor logged in! Token acquired.');

  // 3. Retrieve patient record by QR code using Receptionist token
  console.log('\n🏥 3. Retrieving patient MEDQR-9021 by QR code using Receptionist token...');
  const resRecep = await fetch(`${baseUrl}/patients/qr/MEDQR-9021/full-record`, {
    headers: { 'Authorization': `Bearer ${recepToken}` }
  });
  const dataRecep = await resRecep.json();
  console.log('Receptionist retrieval status code:', resRecep.status);
  console.log('Receptionist retrieval body success:', dataRecep.success);
  console.log('Patient name:', dataRecep.patient?.fullName);
  console.log('Medical records length:', dataRecep.medicalRecords?.length);
  console.log('Reports length:', dataRecep.reports?.length);

  // 4. Retrieve patient record by QR code using Doctor token
  console.log('\n🩺 4. Retrieving patient MEDQR-9021 by QR code using Doctor token...');
  const resDoc = await fetch(`${baseUrl}/patients/qr/MEDQR-9021/full-record`, {
    headers: { 'Authorization': `Bearer ${docToken}` }
  });
  const dataDoc = await resDoc.json();
  console.log('Doctor retrieval status code:', resDoc.status);
  console.log('Doctor retrieval body success:', dataDoc.success);
  console.log('Patient name:', dataDoc.patient?.fullName);
  console.log('Medical records length:', dataDoc.medicalRecords?.length);
  console.log('Reports length:', dataDoc.reports?.length);
  if (dataDoc.medicalRecords?.length > 0) {
    console.log('First Medical record diagnosis:', dataDoc.medicalRecords[0].diagnosis);
    console.log('First Medical record doctor name:', dataDoc.medicalRecords[0].doctorId?.fullName || dataDoc.medicalRecords[0].doctorId);
  }

  console.log('\n🎉 Phase 5 E2E Tests Complete!');
}

runPhase5Tests();
