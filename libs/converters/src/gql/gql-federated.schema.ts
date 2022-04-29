import { FederatedSchema } from '../federated.schema';

export interface GqlFederatedSchema extends FederatedSchema {
  schema: string;
}
