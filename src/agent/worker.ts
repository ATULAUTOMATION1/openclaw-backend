import cron from 'node-cron';
import dotenv from 'dotenv';
import { runMarketingCycle } from './logic';
import { addLog } from './logger';

// Load environment variables locally
dotenv.config();

console.log("==========================================");
console.log("🤖 OPENCLAW MARKETING AGENT INITIALIZED  ");
console.log("==========================================");

addLog('SYSTEM', 'Worker background process started.');

// -----------------------------------------------------
// CRON SCHEDULES
// -----------------------------------------------------
// Run daily at 9:00 AM UTC
cron.schedule('0 9 * * *', () => {
    runMarketingCycle();
});

// Run immediate test upon startup (for sandbox environments)
if (process.env.NODE_ENV !== 'production') {
    setTimeout(() => {
        addLog('SYSTEM', 'Performing initial dev-mode run...');
        runMarketingCycle();
    }, 2000);
}

// Keep process alive
setInterval(() => {}, 1000 * 60 * 60);
