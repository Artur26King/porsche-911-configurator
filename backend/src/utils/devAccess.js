/**
 * If both nickname and email contain DEV_ACCESS_KEYWORD, skip verification (for testing).
 */
export function isDevAccess(nickname, email) {
  const keyword = process.env.DEV_ACCESS_KEYWORD || 'DEV_ACCESS';
  return (
    typeof nickname === 'string' &&
    typeof email === 'string' &&
    nickname.includes(keyword) &&
    email.includes(keyword)
  );
}
