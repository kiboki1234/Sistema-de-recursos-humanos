const axios = require('axios');

async function testLoginRateLimit() {
    const registerUrl = 'http://localhost:5000/api/auth/register';
    const loginUrl = 'http://localhost:5000/api/auth/login';
    const email = `testuser_${Date.now()}@example.com`; // Unique email
    const validPassword = 'password123';
    const invalidPassword = 'wrongpassword';

    const userData = {
        name: "Test User",
        email: email,
        password: validPassword,
        role: "member",
        student_id: `S${Date.now()}`,
        phone: `P${Date.now()}`
    };

    try {
        console.log('--- Test Start ---');

        // 1. Register User
        console.log(`Registering user: ${email}`);
        try {
            await axios.post(registerUrl, userData);
            console.log('User registered successfully.');
        } catch (error) {
            console.log('Registration failed (might already exist):', error.message);
        }

        // 2. Intentional Failures
        for (let i = 1; i <= 4; i++) {
            console.log(`\nAttempt ${i} with invalid password...`);
            try {
                await axios.post(loginUrl, { email, password: invalidPassword });
                console.log('Unexpected Success (Should have failed)');
            } catch (error) {
                if (error.response) {
                    console.log(`Status: ${error.response.status}`);
                    console.log(`Message: ${error.response.data.message}`);
                    // Check for 403 Forbidden and specific message
                    if (error.response.status === 403 && error.response.data.message.includes('bloqueada')) {
                        console.log('>>> Account Locked as expected!');
                    }
                } else {
                    console.log('Error:', error.message);
                }
            }
        }

        // 3. Wait for lockout
        console.log('\nWaiting for 32 seconds to test unlock...');
        await new Promise(resolve => setTimeout(resolve, 32000));

        // 4. Success Login
        console.log('\nAttempting login with VALID password after wait...');
        try {
            const res = await axios.post(loginUrl, { email, password: validPassword });
            console.log('Login Successful!');
            console.log('Token received:', !!res.data.token);
        } catch (error) {
            console.log('Login failed after wait:', error.response ? error.response.data : error.message);
        }

    } catch (err) {
        console.error('Test Script Error:', err);
    }
}

testLoginRateLimit();
