
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key missing" })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (typeof prompt !== "string" || !prompt.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Enter a prompt" })
      };
    }

    const response = await fetch(
      "https://gen.pollinations.ai/image/" +
        encodeURIComponent(prompt.trim()),
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Image generation failed"
        })
      };
    }

    const image = Buffer.from(
      await response.arrayBuffer()
    );

   return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    image: `data:${response.headers.get("content-type") || "image/jpeg"};base64,${image.toString("base64")}`
  })
};
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
