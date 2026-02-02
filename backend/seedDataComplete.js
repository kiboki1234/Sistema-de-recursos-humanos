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
const Attendance = require('./models/Attendance');

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
        await Attendance.deleteMany({});
        // await Contact.deleteMany({});
        console.log('✅ Base de datos limpiada');

        // CONTRASEÑA EN TEXTO PLANO - El modelo User la hasheará automáticamente
        const plainPassword = '12345678';

        // ========== STRATEGIC COORDINATORS ==========
        console.log('\n👑 Creando Strategic Coordinators...');
        const coordinators = [
            { name: 'Ana García', email: 'coordinador@test.com', student_id: 'SC001', phone: '0991234567' },
            { name: 'Carlos Mendoza', email: 'carlos.coordinator@test.com', student_id: 'SC002', phone: '0991234568' }
        ];

        const createdCoordinators = [];
        for (const coord of coordinators) {
            const user = new User({ ...coord, password: plainPassword, role: 'strategic_coordinator' });
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
            const user = new User({ ...pres, password: plainPassword, role: 'president' });
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
            { name: 'Valentina Cruz', email: 'valentina.vp@test.com', student_id: 'VP004', phone: '0971234570' },
            { name: 'Mateo Vargas', email: 'mateo.vp@test.com', student_id: 'VP005', phone: '0971234571' }
        ];

        const createdVicePresidents = [];
        for (const vp of vicePresidents) {
            const user = new User({ ...vp, password: plainPassword, role: 'vice_president' });
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
            { name: 'Fernando Ortiz', email: 'fernando.leader@test.com', student_id: 'L005', phone: '0961234571' },
            { name: 'Gabriela Rojas', email: 'gabriela.leader@test.com', student_id: 'L006', phone: '0961234572' },
            { name: 'Alejandro Castro', email: 'alejandro.leader@test.com', student_id: 'L007', phone: '0961234573' }
        ];

        const createdLeaders = [];
        for (const leader of leaders) {
            const user = new User({ ...leader, password: plainPassword, role: 'leader' });
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
            { name: 'Daniela Herrera', email: 'daniela.member@test.com', student_id: 'M008', phone: '0951234574' },
            { name: 'Emilio Fernández', email: 'emilio.member@test.com', student_id: 'M009', phone: '0951234575' },
            { name: 'Valeria Díaz', email: 'valeria.member@test.com', student_id: 'M010', phone: '0951234576' },
            { name: 'Ricardo Moreno', email: 'ricardo.member@test.com', student_id: 'M011', phone: '0951234577' },
            { name: 'Lucía Jiménez', email: 'lucia.member@test.com', student_id: 'M012', phone: '0951234578' }
        ];

        const createdMembers = [];
        for (const member of members) {
            const user = new User({ ...member, password: plainPassword, role: 'member' });
            await user.save();
            await new Member({ _id: user._id }).save();
            createdMembers.push(user);
            console.log(`  ✓ ${member.name} (${member.email})`);
        }

        // Todos los usuarios
        const allUsers = [
            ...createdCoordinators,
            ...createdPresidents,
            ...createdVicePresidents,
            ...createdLeaders,
            ...createdMembers
        ];

        // ========== PRACTICES (PASADAS Y FUTURAS) ==========
        console.log('\n📅 Creando Prácticas...');
        const today = new Date();

        // Helper function para crear fecha en el pasado
        const daysAgo = (days) => {
            const date = new Date();
            date.setDate(date.getDate() - days);
            date.setHours(0, 0, 0, 0); // Normalizar a medianoche
            return date;
        };

        // Helper function para crear fecha en el futuro
        const daysFromNow = (days) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            date.setHours(0, 0, 0, 0); // Normalizar a medianoche
            return date;
        };

        const practices = [
            // Prácticas pasadas (hace 4 semanas hasta hoy)
            { title: 'Introducción al Debate Británico', date: daysAgo(28), startTime: '15:00', endTime: '17:00' },
            { title: 'Taller de Oratoria Básica', date: daysAgo(25), startTime: '16:00', endTime: '18:00' },
            { title: 'Debate: Educación Gratuita', date: daysAgo(21), startTime: '14:00', endTime: '16:00' },
            { title: 'Sesión de Argumentación', date: daysAgo(18), startTime: '15:00', endTime: '17:00' },
            { title: 'Simulacro de Torneo Regional', date: daysAgo(14), startTime: '10:00', endTime: '13:00' },
            { title: 'Debate: Tecnología y Privacidad', date: daysAgo(12), startTime: '14:00', endTime: '16:00' },
            { title: 'Taller de Refutación', date: daysAgo(10), startTime: '15:30', endTime: '17:30' },
            { title: 'Práctica General', date: daysAgo(7), startTime: '16:00', endTime: '18:00' },
            { title: 'Debate: Salud Pública', date: daysAgo(5), startTime: '14:00', endTime: '16:00' },
            { title: 'Reunión de Asesoría', date: daysAgo(3), startTime: '17:00', endTime: '18:30' },

            // Prácticas futuras
            { title: 'Debate sobre Economía Global', date: daysFromNow(2), startTime: '14:00', endTime: '16:00' },
            { title: 'Reunión General del Club', date: daysFromNow(3), startTime: '18:00', endTime: '20:00' },
            { title: 'Taller de Argumentación Avanzada', date: daysFromNow(5), startTime: '15:00', endTime: '17:00' },
            { title: 'Simulacro de Debate Parlamentario', date: daysFromNow(7), startTime: '10:00', endTime: '12:00' },
            { title: 'Sesión de Oratoria', date: daysFromNow(10), startTime: '16:00', endTime: '18:00' },
            { title: 'Debate Internacional - Cambio Climático', date: daysFromNow(14), startTime: '14:00', endTime: '16:00' },
            { title: 'Preparación Torneo Nacional', date: daysFromNow(18), startTime: '10:00', endTime: '14:00' },
            { title: 'Debate: Ética en IA', date: daysFromNow(21), startTime: '15:00', endTime: '17:00' }
        ];

        const createdPractices = [];
        for (const practice of practices) {
            const newPractice = new Practice(practice);
            await newPractice.save();
            createdPractices.push(newPractice);
            console.log(`  ✓ ${practice.title} - ${practice.date.toLocaleDateString()}`);
        }

        // ========== ATTENDANCE (para prácticas pasadas) ==========
        console.log('\n📊 Creando Registros de Asistencia...');
        const now = new Date(); // Fecha actual para comparación
        console.log(`   Fecha actual: ${now}`);

        // Debug: mostrar primeras prácticas
        console.log(`   Primera práctica: ${createdPractices[0]?.title} - ${createdPractices[0]?.date}`);
        console.log(`   Es pasada? ${createdPractices[0]?.date < now}`);

        const pastPractices = createdPractices.filter(p => p.date < now);
        console.log(`   Prácticas pasadas encontradas: ${pastPractices.length} de ${createdPractices.length}`);

        ;
        let attendanceCount = 0;

        for (const practice of pastPractices) {
            // Simular asistencia variada (70-95% de asistencia)
            const attendanceRate = 0.7 + Math.random() * 0.25;
            const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5);
            const attendeesCount = Math.floor(allUsers.length * attendanceRate);

            for (let i = 0; i < attendeesCount; i++) {
                const user = shuffledUsers[i];
                const checkInVariation = Math.floor(Math.random() * 15) - 5; // ±5 minutos
                const checkInTime = new Date(practice.date);
                const [hours, minutes] = practice.startTime.split(':');
                checkInTime.setHours(parseInt(hours), parseInt(minutes) + checkInVariation);

                const attendance = new Attendance({
                    user: user._id,
                    practice: practice._id,
                    attended: true,
                    checkInTime: checkInTime
                });
                await attendance.save();
                attendanceCount++;
            }

            console.log(`  ✓ ${practice.title}: ${attendeesCount}/${allUsers.length} asistentes`);
        }

        // ========== TASKS (más variadas) ==========
        console.log('\n✅ Creando Tareas...');
        const tasks = [
            // To Do
            { title: 'Preparar presentación sobre modelo de debate', description: 'Crear slides explicando el modelo de debate británico para nuevos miembros', assignedTo: createdMembers[0]._id, createdBy: createdLeaders[0]._id, status: 'To Do' },
            { title: 'Organizar material de debate', description: 'Recopilar artículos y fuentes para el próximo debate', assignedTo: createdMembers[2]._id, createdBy: createdVicePresidents[0]._id, status: 'To Do' },
            { title: 'Reservar auditorio para marzo', description: 'Contactar con administración para reservar auditorio', assignedTo: createdVicePresidents[1]._id, createdBy: createdPresidents[0]._id, status: 'To Do' },
            { title: 'Preparar cronograma de entrenamientos', description: 'Crear calendario de prácticas y talleres para el semestre', assignedTo: createdMembers[4]._id, createdBy: createdLeaders[1]._id, status: 'To Do' },
            { title: 'Coordinar transporte para torneo', description: 'Organizar buses para el torneo interuniversitario', assignedTo: createdLeaders[4]._id, createdBy: createdPresidents[0]._id, status: 'To Do' },
            { title: 'Comprar materiales de oficina', description: 'Adquirir folders, marcadores y hojas para el club', assignedTo: createdMembers[5]._id, createdBy: createdLeaders[2]._id, status: 'To Do' },
            { title: 'Crear base de datos de jueces', description: 'Compilar lista de posibles jueces para eventos', assignedTo: createdVicePresidents[2]._id, createdBy: createdPresidents[1]._id, status: 'To Do' },

            // Doing
            { title: 'Investigar tema: Inteligencia Artificial', description: 'Investigar argumentos a favor y en contra de la regulación de IA', assignedTo: createdMembers[1]._id, createdBy: createdLeaders[1]._id, status: 'Doing' },
            { title: 'Contactar jueces para torneo', description: 'Llamar a posibles jueces para el torneo del próximo mes', assignedTo: createdLeaders[2]._id, createdBy: createdPresidents[0]._id, status: 'Doing' },
            { title: 'Actualizar base de datos de miembros', description: 'Verificar y actualizar información de contacto de todos los miembros', assignedTo: createdLeaders[3]._id, createdBy: createdVicePresidents[0]._id, status: 'Doing' },
            { title: 'Redactar reglamento interno', description: 'Actualizar el reglamento del club con nuevas políticas', assignedTo: createdVicePresidents[2]._id, createdBy: createdPresidents[1]._id, status: 'Doing' },
            { title: 'Revisar presupuesto anual', description: 'Analizar gastos y proyectar presupuesto para el siguiente año', assignedTo: createdVicePresidents[3]._id, createdBy: createdPresidents[2]._id, status: 'Doing' },
            { title: 'Preparar material de bienvenida', description: 'Diseñar folletos informativos para nuevos miembros', assignedTo: createdMembers[6]._id, createdBy: createdLeaders[0]._id, status: 'Doing' },
            { title: 'Actualizar redes sociales', description: 'Publicar contenido y novedades del club en redes', assignedTo: createdMembers[7]._id, createdBy: createdVicePresidents[1]._id, status: 'Doing' },

            // Done
            { title: 'Diseñar póster de convocatoria', description: 'Crear póster atractivo para reclutar nuevos miembros', assignedTo: createdMembers[3]._id, createdBy: createdLeaders[0]._id, status: 'Done' },
            { title: 'Preparar informe mensual', description: 'Compilar estadísticas y logros del mes para la junta directiva', assignedTo: createdVicePresidents[0]._id, createdBy: createdPresidents[0]._id, status: 'Done' },
            { title: 'Organizar evento de integración', description: 'Coordinar actividad social para miembros del club', assignedTo: createdLeaders[5]._id, createdBy: createdPresidents[1]._id, status: 'Done' },
            { title: 'Enviar invitaciones a ex-alumnos', description: 'Contactar graduados para charla motivacional', assignedTo: createdVicePresidents[4]._id, createdBy: createdPresidents[2]._id, status: 'Done' },
            { title: 'Configurar sistema de votación', description: 'Preparar herramienta online para elecciones internas', assignedTo: createdLeaders[6]._id, createdBy: createdPresidents[0]._id, status: 'Done' },
            { title: 'Realizar mantenimiento equipos', description: 'Revisar y reparar micrófonos y proyector', assignedTo: createdMembers[8]._id, createdBy: createdLeaders[3]._id, status: 'Done' }
        ];

        const createdTasks = [];
        for (const task of tasks) {
            const newTask = new Task(task);
            await newTask.save();
            createdTasks.push(newTask);
            console.log(`  ✓ ${task.title}`);
        }





        // ========== RESUMEN ==========
        console.log('\n' + '='.repeat(70));
        console.log('📊 RESUMEN DE DATOS CREADOS');
        console.log('='.repeat(70));
        console.log(`👑 Strategic Coordinators: ${createdCoordinators.length}`);
        console.log(`🎖️  Presidents: ${createdPresidents.length}`);
        console.log(`⭐ Vice Presidents: ${createdVicePresidents.length}`);
        console.log(`👥 Leaders: ${createdLeaders.length}`);
        console.log(`👤 Members: ${createdMembers.length}`);
        console.log(`📝 Total de Usuarios: ${allUsers.length}`);
        console.log('─'.repeat(70));
        console.log(`📅 Prácticas Totales: ${createdPractices.length} (${pastPractices.length} pasadas, ${createdPractices.length - pastPractices.length} futuras)`);
        console.log(`📊 Registros de Asistencia: ${attendanceCount}`);
        console.log(`✅ Tareas: ${createdTasks.length} (${tasks.filter(t => t.status === 'To Do').length} To Do, ${tasks.filter(t => t.status === 'Doing').length} Doing, ${tasks.filter(t => t.status === 'Done').length} Done)`);
        console.log('='.repeat(70));
        console.log('\n🔑 Contraseña para todos los usuarios: 12345678');
        console.log('\n✅ ¡Seed completo exitosamente con datos realistas!\n');

    } catch (error) {
        console.error('❌ Error al crear seed:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
});
