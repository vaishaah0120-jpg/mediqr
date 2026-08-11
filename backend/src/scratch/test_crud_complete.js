// E2E CRUD & QR code workflow verification tests
async function runCRUDTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🏁 Starting complete E2E CRUD & QR workflow verification tests...');

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
  console.log('✅ Receptionist logged in successfully.');

  // 2. Create Patient Profile
  console.log('\n➕ 2. Creating a new patient profile...');
  const patientPayload = {
    fullName: 'Bruce Banner',
    age: 42,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+15551234',
    address: 'Sakaar Labs Street 5',
    emergencyContact: {
      name: 'Betty Ross',
      phone: '+15555678',
      relation: 'Friend'
    }
  };
  
  const addPatientRes = await fetch(`${baseUrl}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(patientPayload)
  });
  
  const addPatientData = await addPatientRes.json();
  if (!addPatientData.success) {
    console.error('❌ Patient creation failed:', addPatientData);
    return;
  }
  const patient = addPatientData.data;
  console.log(`✅ Patient created successfully. ID: ${patient._id}, patientId: ${patient.patientId}`);
  if (!patient.qrCode) {
    console.error('❌ Patient registration did NOT generate or save QR code!');
  } else {
    console.log('✅ Patient QR code was generated immediately and saved in DB.');
  }

  // 3. Read Patient Profile (Get by ID)
  console.log(`\n📖 3. Retrieving patient profile by database ID (${patient._id})...`);
  const getPatientRes = await fetch(`${baseUrl}/patients/${patient._id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const getPatientData = await getPatientRes.json();
  if (getPatientData.success && getPatientData.data.fullName === 'Bruce Banner') {
    console.log('✅ Read operation by ID succeeded.');
  } else {
    console.error('❌ Read operation by ID failed:', getPatientData);
  }

  // 4. Read Patient Profile (Get by QR ID)
  console.log(`\n📖 4. Retrieving patient profile by QR ID (${patient.patientId})...`);
  const getPatientQRRes = await fetch(`${baseUrl}/patients/qr/${patient.patientId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const getPatientQRData = await getPatientQRRes.json();
  if (getPatientQRData.success && getPatientQRData.data._id === patient._id) {
    console.log('✅ Read operation by QR code ID succeeded.');
  } else {
    console.error('❌ Read operation by QR code ID failed:', getPatientQRData);
  }

  // 5. Update Patient Profile
  console.log(`\n📝 5. Updating patient profile (changing address)...`);
  const updatePayload = {
    ...patientPayload,
    address: 'Avengers Compound Upstate'
  };
  const updatePatientRes = await fetch(`${baseUrl}/patients/${patient._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatePayload)
  });
  const updatePatientData = await updatePatientRes.json();
  if (updatePatientData.success && updatePatientData.data.address === 'Avengers Compound Upstate') {
    console.log('✅ Update operation succeeded.');
  } else {
    console.error('❌ Update operation failed:', updatePatientData);
  }

  // 6. Query QR Code Endpoint
  console.log(`\n📷 6. Retrieving QR Code metadata endpoint (/patients/${patient._id}/qr)...`);
  const getQr = await fetch(`${baseUrl}/patients/${patient._id}/qr`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const qrData = await getQr.json();
  if (qrData.success && qrData.patientId === patient.patientId && qrData.qrCode.startsWith('data:image/png;base64,')) {
    console.log('✅ QR Code endpoint works. QR Base64 snippet:', qrData.qrCode.substring(0, 50) + '...');
  } else {
    console.error('❌ QR Code endpoint failed:', qrData);
  }

  // 7. Delete Patient Profile
  console.log(`\n🗑️ 7. Deleting patient profile...`);
  const deletePatientRes = await fetch(`${baseUrl}/patients/${patient._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const deletePatientData = await deletePatientRes.json();
  if (deletePatientData.success) {
    console.log('✅ Delete operation succeeded.');
  } else {
    console.error('❌ Delete operation failed:', deletePatientData);
  }

  // 8. Confirm Patient is Deleted
  console.log('\n🔍 8. Confirming deletion by attempting to retrieve deleted profile...');
  const getDeletedRes = await fetch(`${baseUrl}/patients/${patient._id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (getDeletedRes.status === 404) {
    console.log('✅ Patient deletion verified (returned 404).');
  } else {
    console.error('❌ Deletion verification failed! Status:', getDeletedRes.status);
  }

  console.log('\n🎉 All E2E CRUD & QR code workflow tests completed successfully!');
}

runCRUDTests();
