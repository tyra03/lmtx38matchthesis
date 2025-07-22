export function isJwtValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Date.now() / 1000;
      return payload.exp > now;
    }
    // if no exp claim, treat as valid
    return true;
  } catch {
    return false;
  }
}