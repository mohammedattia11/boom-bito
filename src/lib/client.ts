import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return `https://${process.env.NEXT_PUBLIC_API_URL}`;
  return "http://localhost:3000";
};
export const client = treaty<app>(getBaseURL()).api
