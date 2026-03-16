import { NextResponse } from 'next/server';
import { getLogs } from '@/agent/logger';

export async function GET() {
    try {
        const logs = getLogs();
        return NextResponse.json({ logs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
