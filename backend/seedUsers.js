const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Usuarios de prueba para cada rol
const testUsers = [
  {
    name: 'Carlos Coordinador',
    email: 'coordinador@test.com',
    password: '12345678',
    role: 'strategic_coordinator',
    student_id: 'EST001',
    phone: '+593-9-12345001'
  },
  {
    name: 'Pedro Presidente',
    email: 'presidente@test.com',
    password: '12345678',
    role: 'president',
    student_id: 'EST002',
    phone: '+593-9-12345002'
  },
  {
    name: 'Victor Vicepresidente',
    email: 'vicepresidente@test.com',
    password: '12345678',
    role: 'vice_president',
    student_id: 'EST003',
    phone: '+593-9-12345003'
  },
  {
    name: 'Luis Líder',
    email: 'lider@test.com',
    password: '12345678',
    role: 'leader',
    student_id: 'EST004',
    phone: '+593-9-12345004'
  },
  {
    name: 'María Miembro',
    email: 'miembro@test.com',
    password: '12345678',
    role: 'member',
    student_id: 'EST005',
    phone: '+593-9-12345005'
  }
];

// Función para crear usuarios
const seedUsers = async () => {
  try {
    console.log('🌱 Iniciando seed de usuarios...\n');

    // Eliminar usuarios de prueba existentes
    const deletedCount = await User.deleteMany({ 
      email: { $in: testUsers.map(u => u.email) } 
    });
    console.log(`🗑️  Eliminados ${deletedCount.deletedCount} usuarios de prueba existentes\n`);

    // Crear nuevos usuarios
    console.log('📝 Creando usuarios de prueba:\n');
    
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      
      console.log(`✅ Usuario creado:`);
      console.log(`   Nombre: ${userData.name}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Rol: ${userData.role}`);
      console.log(`   Student ID: ${userData.student_id}`);
      console.log(`   Teléfono: ${userData.phone}`);
      console.log(`   Contraseña: ${userData.password}`);
      console.log('');
    }

    console.log('✅ Seed completado exitosamente!');
    console.log('\n📋 RESUMEN DE CREDENCIALES:');
    console.log('══════════════════════════════════════════════════════');
    console.log('Todos los usuarios tienen la contraseña: 12345678');
    console.log('══════════════════════════════════════════════════════');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase().padEnd(25)} | ${user.email}`);
    });
    console.log('══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el seed
const run = async () => {
  await connectDB();
  await seedUsers();
};

run();
