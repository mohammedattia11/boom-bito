import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'

const baseURL = process.env.NEXT_PUBLIC_API_URL || (typeof window!==undefined ? window.location.origin : 'http://localhost:3000')

export const client = treaty<app>(baseURL).api
