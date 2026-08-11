import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('URI loaded:', JSON.stringify(uri));
if (uri) {
  console.log('URI Length:', uri.length);
  console.log('Characters code:');
  for (let i = 0; i < uri.length; i++) {
    console.log(`char[${i}]: ${JSON.stringify(uri[i])} (code: ${uri.charCodeAt(i)})`);
  }
} else {
  console.log('URI is undefined');
}
