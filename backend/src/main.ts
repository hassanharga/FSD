import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { EnvironmentVariables } from './env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('api');

  const appConfig = app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const swaggerUsername = appConfig.get<string>('SWAGGER_USERNAME')!;
  const swaggerPassword = appConfig.get<string>('SWAGGER_PASSWORD')!;
  const port = appConfig.get<number>('PORT') || 3000;

  // Swagger
  SwaggerModule.setup('/api/docs', app, swaggerSetup(app, swaggerUsername, swaggerPassword));

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

function swaggerSetup(app: INestApplication, swaggerUsername: string, swaggerPassword: string) {
  // Secure the documentation page

  app.use(
    ['/api/docs', '/api/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [swaggerUsername]: swaggerPassword,
      },
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder().setVersion('1.0.0').addBearerAuth();

  config.setTitle(`App API (${process.env.NODE_ENV})`);
  config.setDescription(`App's API Documentation (${process.env.NODE_ENV} Environment)`);

  return SwaggerModule.createDocument(app, config.build());
}

bootstrap().catch((err) => {
  Logger.error('Error starting application', err);
  process.exit(1);
});
