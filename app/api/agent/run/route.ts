import { NextResponse } from 'next/server';
import { runMarketingCycle } from '@/agent/logic';

export async function POST() {
    try {
        // Trigger the logic
        const result = await runMarketingCycle();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
