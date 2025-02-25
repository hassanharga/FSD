import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  //   Test = 'test',
  //   Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  SWAGGER_USERNAME: string;

  @IsString()
  SWAGGER_PASSWORD: string;

  @IsString()
  MONGO_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsNumber()
  @Min(0)
  THROTTLE_TTL: number;

  @IsNumber()
  @Min(0)
  THROTTLE_LIMIT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
