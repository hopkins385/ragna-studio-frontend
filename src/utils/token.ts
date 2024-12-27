import DOMPurify from 'dompurify';

export const isValidJWT = (token: string): boolean => {
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  return jwtRegex.test(token);
};

export const sanitizeToken = (token: string): string => {
  return DOMPurify.sanitize(token.trim());
};
