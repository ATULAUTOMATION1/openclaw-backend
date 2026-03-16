import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data', 'logs.json');

export interface LogEntry {
    timestamp: string;
    type: 'SYSTEM' | 'AI' | 'SOCIAL' | 'BLOG' | 'ERROR';
    message: string;
}

export function addLog(type: LogEntry['type'], message: string) {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = { timestamp, type, message };
    
    console.log(`[${type}] ${message}`);

    try {
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let logs: LogEntry[] = [];
        if (fs.existsSync(LOG_FILE)) {
            const content = fs.readFileSync(LOG_FILE, 'utf8');
            logs = JSON.parse(content);
        }

        logs.unshift(entry);
        // Keep only last 100 logs
        logs = logs.slice(0, 100);

        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error("Failed to write log to file:", err);
    }
}

export function getLogs(): LogEntry[] {
    try {
        if (fs.existsSync(LOG_FILE)) {
            return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        }
    } catch (err) {
        console.error("Failed to read logs:", err);
    }
    return [];
}
