// src/app/api/raffles/[id]/route.ts
import { NextResponse } from 'next/server';
import { PoolType } from '@/data/types/pool.type';
// In a real application, you would fetch this from a database or a more robust source.             
// For now, we will simulate this by fetching the full list and finding the item.                   
import { mockPools } from '@/data/mock-pools'; // Import the mock data

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;


        // const pool = allPools.find((p: PoolType) => p.id === id);
        const pool = mockPools.find((p: PoolType) => p.id === id);

        // Note: In a real async function, you would await this.
        // For this synchronous function, it just runs.
        setTimeout(() => { }, 300);


        // Add a short delay to simulate a real network request
        // await new Promise(resolve => setTimeout(resolve, 300));

        if (pool) {
            return NextResponse.json(pool);
        } else {
            return NextResponse.json({ error: 'Raffle not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
