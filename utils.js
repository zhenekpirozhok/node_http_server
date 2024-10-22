export async function bodyParser(req) {
  const body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  return body;
}
