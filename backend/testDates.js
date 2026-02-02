// Script de prueba para debuggear el problema de fechas
const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const daysFromNow = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const now = new Date();
console.log('Fecha actual (now):', now);
console.log('Fecha hace 28 días:', daysAgo(28));
console.log('Fecha hace 3 días:', daysAgo(3));
console.log('Fecha en 2 días:', daysFromNow(2));

// Comparación
const past = daysAgo(7);
console.log('\nComparación:');
console.log(`${past} < ${now}?`, past < now);
console.log(` ${past.getTime()} < ${now.getTime()}?`, past.getTime() < now.getTime());
