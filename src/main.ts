import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.port ?? 3000, () => {
    console.log(`🚀 Server is running on ${env.baseURL}`);
  });
}
bootstrap().catch(console.error);
