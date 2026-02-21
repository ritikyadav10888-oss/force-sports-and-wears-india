import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const API_URL = 'http://localhost:5000/api';

async function verifyVulnerabilities() {
    console.log('--- Verifying Vulnerabilities ---');

    // 1. Hardcoded Admin Login
    try {
        console.log('\n[1] Testing Hardcoded Admin Login...');
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@force.com',
            password: 'Admin@123'
        });

        if (res.data.message.includes('Hardcoded Admin')) {
            console.log('🔴 FAILURE: Hardcoded admin login still works!');
        } else {
            console.log('🟢 SUCCESS: Login succeeded via Database (Hardcoded check removed).');
        }
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403 || error.response?.data?.error === 'Invalid credentials') {
             console.log('🟢 SUCCESS: Hardcoded admin login blocked (or user not found/invalid creds).');
        } else {
             console.log('🔴 FAILURE: Hardcoded admin login failed with unexpected error:', error.message);
        }
    }

    // 2. Unauthenticated File Upload
    try {
        console.log('\n[2] Testing Unauthenticated File Upload...');
        const form = new FormData();
        form.append('image', Buffer.from('fake image content'), 'test.txt');

        await axios.post(`${API_URL}/upload`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('🔴 FAILURE: Unauthenticated file upload succeeded!');
    } catch (error: any) {
         if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🟢 SUCCESS: Unauthenticated file upload blocked.');
        } else {
            console.log('🔴 FAILURE: Upload failed with unexpected error:', error.response?.status);
        }
    }

    console.log('\n[3] Price Manipulation Check: Verified by code inspection (Order Controller now fetches prices from DB).');
}

verifyVulnerabilities();
