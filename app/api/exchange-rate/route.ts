import { NextResponse } from 'next/server';

// In-memory cache
let cache = {
  rate: 0,
  timestamp: 0
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
  const currentTime = Date.now();
  
  // Return cached rate if it's still valid
  if (cache.rate && currentTime - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache);
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/EUR/SEK`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch exchange rate');
    }

    // Update cache
    cache = {
      rate: data.conversion_rate,
      timestamp: currentTime
    };

    return NextResponse.json(cache);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
}
