const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth/login';

const testUsers = [
    { email: 'coordinador@test.com', role: 'strategic_coordinator' },
    { email: 'presidente@test.com', role: 'president' },
    { email: 'vicepresidente@test.com', role: 'vice_president' },
    { email: 'lider@test.com', role: 'leader' },
    { email: 'miembro@test.com', role: 'member' }
];

const testLogin = async () => {
    console.log('🧪 Probando login de usuarios de prueba...\n');

    for (const user of testUsers) {
        try {
            const response = await axios.post(API_URL, {
                email: user.email,
                password: '12345678'
            });

            console.log(`✅ ${user.role.toUpperCase().padEnd(25)} - Login exitoso`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nombre: ${response.data.user.name}`);
            console.log(`   Token generado: ${response.data.token.substring(0, 50)}...`);
            console.log('');

        } catch (error) {
            console.log(`❌ ${user.role.toUpperCase().padEnd(25)} - Error`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
            console.log('');
        }
    }

    console.log('✅ Verificación completada!');
};

testLogin();
