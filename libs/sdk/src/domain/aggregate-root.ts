import { Entity } from './entity';
import { SHA256Identifier } from './sha256-identifier';

export abstract class AggregateRoot<T> extends Entity<T> {
  // TODO: Add events support for aggregate roots using event system in Nest
  // https://ikigai-technologies.atlassian.net/browse/LOG-71
}
