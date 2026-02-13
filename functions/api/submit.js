export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { name, email, response } = await context.request.json();

    if (!name || !email || !response) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers }
      );
    }

    await context.env.DB.prepare(
      'INSERT INTO submissions (name, email, response, created_at) VALUES (?, ?, ?, ?)'
    ).bind(name, email, response, new Date().toISOString()).run();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
