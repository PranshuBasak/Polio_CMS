import { NextResponse } from 'next/server';

interface OpenMeteoCurrentWeatherResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
}

interface OpenMeteoGeocodeResponse {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const getLocationFromSearch = async (location: string) => {
  const geocodeResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
    { cache: 'no-store' }
  );

  if (!geocodeResponse.ok) {
    throw new Error(`Open-Meteo geocoding failed: ${geocodeResponse.status}`);
  }

  const geocodePayload = (await geocodeResponse.json()) as OpenMeteoGeocodeResponse;
  const firstMatch = geocodePayload.results?.[0];
  if (!firstMatch) {
    throw new Error('No matching location found');
  }

  return {
    latitude: firstMatch.latitude,
    longitude: firstMatch.longitude,
    locationLabel: firstMatch.country
      ? `${firstMatch.name}, ${firstMatch.country}`
      : firstMatch.name,
  };
};

const parseCoordinate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getWeatherLabel = (code?: number) => {
  if (typeof code !== 'number') {
    return 'Unknown';
  }

  return WEATHER_CODE_LABELS[code] || `Weather code ${code}`;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitudeParam = parseCoordinate(searchParams.get('latitude'));
    const longitudeParam = parseCoordinate(searchParams.get('longitude'));
    const location = (searchParams.get('location') || 'New York').trim();

    const hasCoordinates =
      typeof latitudeParam === 'number' && typeof longitudeParam === 'number';

    const coordinateSource = hasCoordinates
      ? {
          latitude: latitudeParam,
          longitude: longitudeParam,
          locationLabel: `Lat ${latitudeParam.toFixed(4)}, Lon ${longitudeParam.toFixed(4)}`,
        }
      : await getLocationFromSearch(location);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordinateSource.latitude}&longitude=${coordinateSource.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Open-Meteo weather failed: ${response.status}`);
    }

    const payload = (await response.json()) as OpenMeteoCurrentWeatherResponse;
    const current = payload.current;

    if (!current) {
      throw new Error('Missing current weather data block');
    }

    const responseJson = NextResponse.json({
      success: true,
      weather: {
        location: coordinateSource.locationLabel,
        country: '',
        condition: getWeatherLabel(current.weather_code),
        temperatureC: Number(current.temperature_2m || 0),
        feelsLikeC: Number(current.apparent_temperature || 0),
        humidity: Number(current.relative_humidity_2m || 0),
        windKmph: Number(current.wind_speed_10m || 0),
        latitude: coordinateSource.latitude,
        longitude: coordinateSource.longitude,
        timezone: payload.timezone || 'auto',
      },
    });
    responseJson.headers.set('Access-Control-Allow-Origin', '*');
    responseJson.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    responseJson.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return responseJson;
  } catch (error) {
    console.error('Terminal weather route failed:', error);
    const errorJson = NextResponse.json(
      {
        success: false,
        error: 'Unable to fetch weather right now.',
      },
      { status: 500 }
    );
    errorJson.headers.set('Access-Control-Allow-Origin', '*');
    errorJson.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    errorJson.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorJson;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
