import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  SECRET: z.string().min(10, 'JWT SECRET must be at least 10 characters'),
  MONGODB_URI: z.string().default('mongodb://0.0.0.0/BarbeariaReact'),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().default('0.0.0.0'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
