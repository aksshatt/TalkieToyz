// Pings the backend health endpoint every 10 minutes to prevent
// Render free-tier services from spinning down after 15 min idle.

const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function getHealthUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  // Strip /api/v1 (or any trailing path) to get the root URL
  const rootUrl = apiUrl.replace(/\/api\/v\d+\/?$/, '');
  return `${rootUrl}/health`;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

async function ping(): Promise<void> {
  try {
    await fetch(getHealthUrl(), { method: 'GET', mode: 'no-cors' });
  } catch {
    // Silently ignore — network errors shouldn't affect the app
  }
}

export function startKeepAlive(): void {
  if (intervalId !== null) return; // Already running
  ping(); // Ping immediately on start
  intervalId = setInterval(ping, PING_INTERVAL_MS);
}

export function stopKeepAlive(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
