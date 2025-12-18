export async function runResearch(query) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Research API failed: " + errorText);
  }

  const data = await response.json();
  return data;
}
