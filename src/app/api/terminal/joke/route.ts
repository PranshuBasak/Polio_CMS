import { NextResponse } from 'next/server';

interface JokeResponse {
  setup?: string;
  punchline?: string;
}

export async function GET() {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Joke API responded with ${response.status}`);
    }

    const payload = (await response.json()) as JokeResponse;
    if (!payload.setup || !payload.punchline) {
      throw new Error('Joke payload was missing required fields');
    }

    return NextResponse.json({
      success: true,
      joke: {
        setup: payload.setup,
        punchline: payload.punchline,
      },
    });
  } catch (error) {
    console.error('Terminal joke route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to fetch a joke right now.',
      },
      { status: 500 }
    );
  }
}

