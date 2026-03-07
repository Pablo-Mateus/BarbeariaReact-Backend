import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import app from './app.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.PORT, env.HOST, () => {
    console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Falha ao iniciar servidor:', err);
  process.exit(1);
});
