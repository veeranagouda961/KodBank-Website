// Test DNS resolution for AIVEN MySQL hostname
import dns from 'dns/promises';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const hostname = process.env.DB_HOST || 'mysql-1e7e9ff6-veeranagouda961-b54a.i.aivencloud.com';

console.log('🔍 Testing DNS resolution for:', hostname);
console.log('');

// Test 1: Using Node.js dns module
try {
  console.log('Test 1: Node.js DNS lookup...');
  const addresses = await dns.lookup(hostname, { family: 4 });
  console.log('✅ DNS resolved successfully!');
  console.log('   IP Address:', addresses.address);
  console.log('   Family:', addresses.family);
} catch (err) {
  console.log('❌ DNS lookup failed:', err.message);
  console.log('   Code:', err.code);
}

console.log('');

// Test 2: Using resolve4
try {
  console.log('Test 2: DNS resolve4...');
  const addresses = await dns.resolve4(hostname);
  console.log('✅ DNS resolve4 successful!');
  console.log('   IP Addresses:', addresses.join(', '));
} catch (err) {
  console.log('❌ DNS resolve4 failed:', err.message);
  console.log('   Code:', err.code);
}

console.log('');

// Test 3: Try with different DNS servers
console.log('Test 3: Testing with different DNS servers...');
const dnsServers = ['8.8.8.8', '1.1.1.1', '208.67.222.222'];

for (const server of dnsServers) {
  try {
    const resolver = new dns.Resolver();
    resolver.setServers([server]);
    const addresses = await resolver.resolve4(hostname);
    console.log(`✅ ${server} (Google/Cloudflare/OpenDNS) resolved successfully!`);
    console.log('   IP Addresses:', addresses.join(', '));
    break;
  } catch (err) {
    console.log(`❌ ${server} failed:`, err.message);
  }
}

console.log('');
console.log('💡 If all tests fail:');
console.log('   1. Your network may be blocking AIVEN domains');
console.log('   2. Try using a VPN');
console.log('   3. Check if AIVEN service is paused in console');
console.log('   4. Try flushing DNS: ipconfig /flushdns');
