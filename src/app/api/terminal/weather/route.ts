import { NextResponse } from 'next/server';

interface WttrResponse {
  current_condition?: Array<{
    temp_C?: string;
    FeelsLikeC?: string;
    weatherDesc?: Array<{ value?: string }>;
    humidity?: string;
    windspeedKmph?: string;
  }>;
  nearest_area?: Array<{
    areaName?: Array<{ value?: string }>;
    country?: Array<{ value?: string }>;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = (searchParams.get('location') || 'New York').trim();

    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
      {
        headers: {
          'User-Agent': 'dynamicfolio-terminal/1.0',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`wttr.in responded with ${response.status}`);
    }

    const payload = (await response.json()) as WttrResponse;
    const current = payload.current_condition?.[0];
    const nearest = payload.nearest_area?.[0];

    if (!current) {
      throw new Error('Missing current weather block');
    }

    return NextResponse.json({
      success: true,
      weather: {
        location: nearest?.areaName?.[0]?.value || location,
        country: nearest?.country?.[0]?.value || '',
        condition: current.weatherDesc?.[0]?.value || 'Unknown',
        temperatureC: Number(current.temp_C || 0),
        feelsLikeC: Number(current.FeelsLikeC || 0),
        humidity: Number(current.humidity || 0),
        windKmph: Number(current.windspeedKmph || 0),
      },
    });
  } catch (error) {
    console.error('Terminal weather route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to fetch weather right now.',
      },
      { status: 500 }
    );
  }
}

