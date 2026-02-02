const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const StrategicCoordinator = require('./models/StrategicCoordinator');
const President = require('./models/President');
const VicePresident = require('./models/VicePresident');
const Leader = require('./models/Leader');
const Member = require('./models/Member');
const Task = require('./models/Task');
const Practice = require('./models/Practice');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', async () => {
    console.log('Conectado a MongoDB');

    try {
        // Limpiar colecciones existentes
        console.log('\n🗑️  Limpiando base de datos...');
        await User.deleteMany({});
        await StrategicCoordinator.deleteMany({});
        await President.deleteMany({});
        await VicePresident.deleteMany({});
        await Leader.deleteMany({});
        await Member.deleteMany({});
        await Task.deleteMany({});
        await Practice.deleteMany({});
        console.log('✅ Base de datos limpiada');

        // Encriptar contraseña común
        const hashedPassword = await bcrypt.hash('12345678', 10);

        // ========== STRATEGIC COORDINATORS ==========
        console.log('\n👑 Creando Strategic Coordinators...');
        const coordinators = [
            { name: 'Ana García', email: 'coordinador@test.com', student_id: 'SC001', phone: '0991234567' },
            { name: 'Carlos Mendoza', email: 'carlos.coordinator@test.com', student_id: 'SC002', phone: '0991234568' }
        ];

        const createdCoordinators = [];
        for (const coord of coordinators) {
            const user = new User({ ...coord, password: hashedPassword, role: 'strategic_coordinator' });
            await user.save();
            await new StrategicCoordinator({ _id: user._id }).save();
            createdCoordinators.push(user);
            console.log(`  ✓ ${coord.name} (${coord.email})`);
        }

        // ========== PRESIDENTS ==========
        console.log('\n🎖️  Creando Presidents...');
        const presidents = [
            { name: 'María Rodríguez', email: 'presidente@test.com', student_id: 'P001', phone: '0981234567' },
            { name: 'Juan Pérez', email: 'juan.president@test.com', student_id: 'P002', phone: '0981234568' },
            { name: 'Laura Sánchez', email: 'laura.president@test.com', student_id: 'P003', phone: '0981234569' }
        ];

        const createdPresidents = [];
        for (const pres of presidents) {
            const user = new User({ ...pres, password: hashedPassword, role: 'president' });
            await user.save();
            await new President({ _id: user._id }).save();
            createdPresidents.push(user);
            console.log(`  ✓ ${pres.name} (${pres.email})`);
        }

        // ========== VICE PRESIDENTS ==========
        console.log('\n⭐ Creando Vice Presidents...');
        const vicePresidents = [
            { name: 'Pedro Gómez', email: 'vicepresidente@test.com', student_id: 'VP001', phone: '0971234567' },
            { name: 'Sofía Martínez', email: 'sofia.vp@test.com', student_id: 'VP002', phone: '0971234568' },
            { name: 'Diego Torres', email: 'diego.vp@test.com', student_id: 'VP003', phone: '0971234569' },
            { name: 'Valentina Cruz', email: 'valentina.vp@test.com', student_id: 'VP004', phone: '0971234570' }
        ];

        const createdVicePresidents = [];
        for (const vp of vicePresidents) {
            const user = new User({ ...vp, password: hashedPassword, role: 'vice_president' });
            await user.save();
            await new VicePresident({ _id: user._id }).save();
            createdVicePresidents.push(user);
            console.log(`  ✓ ${vp.name} (${vp.email})`);
        }

        // ========== LEADERS ==========
        console.log('\n👥 Creando Leaders...');
        const leaders = [
            { name: 'Luis Ramírez', email: 'lider@test.com', student_id: 'L001', phone: '0961234567' },
            { name: 'Carmen Flores', email: 'carmen.leader@test.com', student_id: 'L002', phone: '0961234568' },
            { name: 'Roberto Silva', email: 'roberto.leader@test.com', student_id: 'L003', phone: '0961234569' },
            { name: 'Andrea Morales', email: 'andrea.leader@test.com', student_id: 'L004', phone: '0961234570' },
            { name: 'Fernando Ortiz', email: 'fernando.leader@test.com', student_id: 'L005', phone: '0961234571' }
        ];

        const createdLeaders = [];
        for (const leader of leaders) {
            const user = new User({ ...leader, password: hashedPassword, role: 'leader' });
            await user.save();
            await new Leader({ _id: user._id }).save();
            createdLeaders.push(user);
            console.log(`  ✓ ${leader.name} (${leader.email})`);
        }

        // ========== MEMBERS ==========
        console.log('\n👤 Creando Members...');
        const members = [
            { name: 'José González', email: 'miembro@test.com', student_id: 'M001', phone: '0951234567' },
            { name: 'Patricia López', email: 'patricia.member@test.com', student_id: 'M002', phone: '0951234568' },
            { name: 'Miguel Vargas', email: 'miguel.member@test.com', student_id: 'M003', phone: '0951234569' },
            { name: 'Isabella Ruiz', email: 'isabella.member@test.com', student_id: 'M004', phone: '0951234570' },
            { name: 'Andrés Castillo', email: 'andres.member@test.com', student_id: 'M005', phone: '0951234571' },
            { name: 'Carolina Navarro', email: 'carolina.member@test.com', student_id: 'M006', phone: '0951234572' },
            { name: 'Sebastián Rojas', email: 'sebastian.member@test.com', student_id: 'M007', phone: '0951234573' },
            { name: 'Daniela Herrera', email: 'daniela.member@test.com', student_id: 'M008', phone: '0951234574' }
        ];

        const createdMembers = [];
        for (const member of members) {
            const user = new User({ ...member, password: hashedPassword, role: 'member' });
            await user.save();
            await new Member({ _id: user._id }).save();
            createdMembers.push(user);
            console.log(`  ✓ ${member.name} (${member.email})`);
        }

        // ========== PRACTICES ==========
        console.log('\n📅 Creando Prácticas...');
        const today = new Date();
        const practices = [
            {
                title: 'Debate sobre Economía Global',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
                startTime: '14:00',
                endTime: '16:00'
            },
            {
                title: 'Taller de Argumentación',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
                startTime: '15:00',
                endTime: '17:00'
            },
            {
                title: 'Simulacro de Debate Parlamentario',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
                startTime: '10:00',
                endTime: '12:00'
            },
            {
                title: 'Sesión de Oratoria',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
                startTime: '16:00',
                endTime: '18:00'
            },
            {
                title: 'Debate Internacional - Cambio Climático',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
                startTime: '14:00',
                endTime: '16:00'
            },
            {
                title: 'Reunión General del Club',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                startTime: '18:00',
                endTime: '20:00'
            }
        ];

        const createdPractices = [];
        for (const practice of practices) {
            const newPractice = new Practice(practice);
            await newPractice.save();
            createdPractices.push(newPractice);
            console.log(`  ✓ ${practice.title} - ${practice.date.toLocaleDateString()}`);
        }

        // ========== TASKS ==========
        console.log('\n✅ Creando Tareas...');
        const tasks = [
            {
                title: 'Preparar presentación sobre modelo de debate',
                description: 'Crear slides explicando el modelo de debate británico para nuevos miembros',
                assignedTo: createdMembers[0]._id,
                createdBy: createdLeaders[0]._id,
                status: 'To Do'
            },
            {
                title: 'Investigar tema: Inteligencia Artificial',
                description: 'Investigar argumentos a favor y en contra de la regulación de IA',
                assignedTo: createdMembers[1]._id,
                createdBy: createdLeaders[1]._id,
                status: 'Doing'
            },
            {
                title: 'Organizar material de debate',
                description: 'Recopilar artículos y fuentes para el próximo debate',
                assignedTo: createdMembers[2]._id,
                createdBy: createdVicePresidents[0]._id,
                status: 'To Do'
            },
            {
                title: 'Contactar jueces para torneo',
                description: 'Llamar a posibles jueces para el torneo del próximo mes',
                assignedTo: createdLeaders[2]._id,
                createdBy: createdPresidents[0]._id,
                status: 'Doing'
            },
            {
                title: 'Diseñar póster de convocatoria',
                description: 'Crear póster atractivo para reclutar nuevos miembros',
                assignedTo: createdMembers[3]._id,
                createdBy: createdLeaders[0]._id,
                status: 'Done'
            },
            {
                title: 'Reservar auditorio',
                description: 'Contactar con administración para reservar auditorio para el debate',
                assignedTo: createdVicePresidents[1]._id,
                createdBy: createdPresidents[0]._id,
                status: 'To Do'
            },
            {
                title: 'Actualizar base de datos de miembros',
                description: 'Verificar y actualizar información de contacto de todos los miembros',
                assignedTo: createdLeaders[3]._id,
                createdBy: createdVicePresidents[0]._id,
                status: 'Doing'
            },
            {
                title: 'Preparar cronograma de entrenamientos',
                description: 'Crear calendario de prácticas y talleres para el semestre',
                assignedTo: createdMembers[4]._id,
                createdBy: createdLeaders[1]._id,
                status: 'To Do'
            },
            {
                title: 'Redactar reglamento interno',
                description: 'Actualizar el reglamento del club con nuevas políticas',
                assignedTo: createdVicePresidents[2]._id,
                createdBy: createdPresidents[1]._id,
                status: 'Doing'
            },
            {
                title: 'Coordinar transporte para torneo',
                description: 'Organizar buses para el torneo interuniversitario',
                assignedTo: createdLeaders[4]._id,
                createdBy: createdPresidents[0]._id,
                status: 'To Do'
            },
            {
                title: 'Preparar informe mensual',
                description: 'Compilar estadísticas y logros del mes para la junta directiva',
                assignedTo: createdVicePresidents[0]._id,
                createdBy: createdPresidents[0]._id,
                status: 'Done'
            },
            {
                title: 'Revisar presupuesto anual',
                description: 'Analizar gastos y proyectar presupuesto para el siguiente año',
                assignedTo: createdVicePresidents[3]._id,
                createdBy: createdPresidents[2]._id,
                status: 'Doing'
            }
        ];

        const createdTasks = [];
        for (const task of tasks) {
            const newTask = new Task(task);
            await newTask.save();
            createdTasks.push(newTask);
            console.log(`  ✓ ${task.title} - Asignado a: ${task.assignedTo}`);
        }

        // ========== RESUMEN ==========
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DE DATOS CREADOS');
        console.log('='.repeat(60));
        console.log(`👑 Strategic Coordinators: ${createdCoordinators.length}`);
        console.log(`🎖️  Presidents: ${createdPresidents.length}`);
        console.log(`⭐ Vice Presidents: ${createdVicePresidents.length}`);
        console.log(`👥 Leaders: ${createdLeaders.length}`);
        console.log(`👤 Members: ${createdMembers.length}`);
        console.log(`📅 Prácticas: ${createdPractices.length}`);
        console.log(`✅ Tareas: ${createdTasks.length}`);
        console.log('='.repeat(60));
        console.log(`\n📝 Total de Usuarios: ${createdCoordinators.length + createdPresidents.length + createdVicePresidents.length + createdLeaders.length + createdMembers.length}`);
        console.log('\n🔑 Contraseña para todos los usuarios: 12345678');
        console.log('\n✅ ¡Seed completado exitosamente!\n');

    } catch (error) {
        console.error('❌ Error al crear seed:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
});
