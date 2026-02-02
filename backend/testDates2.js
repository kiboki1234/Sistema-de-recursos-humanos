// Test dates con setHours
const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0); // Normalizar a medianoche
    return date;
};

const now = new Date();
const past = daysAgo(7);

console.log('now:', now);
console.log('now timestamp:', now.getTime());
console.log('past:', past);
console.log('past timestamp:', past.getTime());
console.log('past < now?', past < now);
console.log('past.getTime() < now.getTime()?', past.getTime() < now.getTime());
