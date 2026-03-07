import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import app from './app.js';
async function bootstrap() {
    await connectDatabase();
    app.listen(env.PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map