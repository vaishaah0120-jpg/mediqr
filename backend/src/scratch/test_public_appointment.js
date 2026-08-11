// E2E Verification for Public Appointment Booking API (Phase 6)
// Using Node 22 built-in fetch

async function runPublicAppointmentTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🏁 Starting E2E Verification Tests for Public Appointments...');

  // 1. Fetch public doctors list
  console.log('\n🏥 1. Fetching public doctors list...');
  const docRes = await fetch(`${baseUrl}/doctors/public`);
  const docData = await docRes.json();
  
  if (!docData.success || !docData.data || docData.data.length === 0) {
    console.error('❌ Failed to fetch doctors list:', docData);
    return;
  }
  
  const doctor = docData.data[0];
  console.log(`✅ Doctors fetched successfully! Total: ${docData.count}`);
  console.log(`Selected doctor for booking: ${doctor.fullName} (${doctor.specialization}) - ID: ${doctor._id}`);

  // 2. Submit a public booking request
  console.log('\n📅 2. Submitting public appointment booking form...');
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 5); // 5 days in future

  const payload = {
    fullName: 'Bruce Wayne',
    age: 38,
    gender: 'Male',
    bloodGroup: 'AB-',
    phone: '+15550077',
    address: '1007 Mountain Drive, Gotham City',
    emergencyContactName: 'Alfred Pennyworth',
    emergencyContactPhone: '+15550076',
    emergencyContactRelation: 'Friend',
    doctorId: doctor._id,
    appointmentDate: appointmentDate.toISOString(),
  };

  const bookingRes = await fetch(`${baseUrl}/appointments/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const bookingData = await bookingRes.json();
  
  if (bookingRes.status !== 201 || !bookingData.success) {
    console.error('❌ Appointment booking failed:', bookingData);
    return;
  }

  console.log('✅ Public booking succeeded! Status code: 201');
  console.log('Returned patient fullName:', bookingData.data?.patient?.fullName);
  console.log('Generated patientId:', bookingData.data?.patient?.patientId);
  console.log('Generated patient QR Code Base64 snippet:', bookingData.data?.patient?.qrCode ? bookingData.data.patient.qrCode.substring(0, 50) + '...' : 'None');
  console.log('Created appointment ID:', bookingData.data?.appointment?._id);
  console.log('Created appointment status:', bookingData.data?.appointment?.status);
  
  // 3. Verify that a receptionist login can view the newly created patient
  console.log('\n🔑 3. Logging in as Receptionist to verify patient sync...');
  const recepLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'receptionist@mediqr.com', password: 'RecepPass123', role: 'receptionist' })
  });
  const recepData = await recepLogin.json();
  const token = recepData.token;

  console.log('🔍 4. Querying patients list as Receptionist for the new patient...');
  const patientRes = await fetch(`${baseUrl}/patients`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const patientData = await patientRes.json();
  
  const found = patientData.data?.find(p => p.phone === '+15550077');
  if (found) {
    console.log('✅ Success! The new patient booked from the public website is fully synced in the EMR database.');
    console.log(`Synced patient details: ID: ${found.patientId} Name: ${found.fullName}`);
  } else {
    console.error('❌ Failed to locate the booked patient in the EMR database.');
  }

  console.log('\n🎉 E2E Verification Tests Completed Successfully!');
}

runPublicAppointmentTests();
