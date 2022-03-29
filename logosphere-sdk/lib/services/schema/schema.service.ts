import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration, constants as cc } from '../../configuration';
import { CanonicalSchema } from '../../codegen/canonical.schema';
import {
  JsonFederatedSchemaParser,
  jsonFederatedSchemaLoader,
} from '../../codegen/json-schema';

/**
 * Provides Logosphere schemas
 */
@Injectable()
export class SchemaService {
  private _canonical: CanonicalSchema;
  private _configPath: string;
  private _config: Configuration;

  constructor(private readonly configService: ConfigService) {
    this._config = this.configService.get<Configuration>('config');
  }

  public canonical(): CanonicalSchema {
    if (!this._canonical) {
      const parser = new JsonFederatedSchemaParser();
      this._canonical = parser.parse(
        jsonFederatedSchemaLoader(this._config._configPath)
      );
    }
    return this._canonical;
  }
}
