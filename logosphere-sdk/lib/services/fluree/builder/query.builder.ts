import {
  FlureeOrderClause,
  FlureeQueryOptions,
  FlureeFromClause,
  ReferenceOptions,
} from '../fluree.schema';
import { PredicateNode, QuerySpec, ReferenceNode } from './query.schema';

/**
 * A point in creating the query where it can be built
 */
interface BuildableStep {
  /**
   * Returns the completed query specification.
   */
  build(): QuerySpec;
}

/**
 * This buildable step allows configuration of query parameters.
 */
interface OptionsStep extends BuildableStep {
  /**
   * Adds the limit to the query spec and repeats the options step
   * @param limit The maximum number of results to return for the query
   */
  limit(limit: number): OptionsStep;

  /**
   * Adds the offset to the query spec and repeats the options step
   * @param offset The number of results to skip before including in the result set.
   */
  offset(offset: number): OptionsStep;

  /**
   * Adds the order by clause to the query spec and repeats the options step
   * @param orderBy The predicate or the order and predicate to order the result set by
   */
  orderBy(orderBy: FlureeOrderClause): OptionsStep;

  /**
   * Adds or replaces the query options object in the query spec and returns the build step
   * @param options The options object to include in the query spec
   */
  options(options: FlureeQueryOptions): BuildableStep;
}

/**
 * After the select step a where clause or a from clause must be specified.
 */
interface SelectStep {
  /**
   * Adds the passed in from clause and moves on to the next step
   * @param clause The from clause to be added the current query specification
   */
  from(clause: FlureeFromClause): FromStep;

  /**
   * Adds the passed in where clause and moves on to the next step
   * @param clause The where clause to be added to the current query specification
   */
  where(clause: string): WhereStep;
}

/**
 * After the from step a where cause can still ber applied.
 */
interface FromStep extends OptionsStep {
  /**
   * Adds the passed in where clause and moves on to the next step
   * @param clause The where clause to be added to the current query specification
   */
  where(clause: string): WhereStep;
}

/**
 * After an `AND` step additional `AND` clauses can be applied.
 */
interface AndStep extends OptionsStep {
  /**
   * Adds the additional where clause with an `AND` operator and moves on to the next step
   * @param clause the additoinal where class to add to the spec.
   */
  and(clause: string): AndStep;
}

/**
 * After an `OR` step additional `OR` clauses can be applied.
 */
interface OrStep extends OptionsStep {
  /**
   * Adds the additional where clause with an `AND` operator and moves on to the next step
   * @param clause the additoinal where class to add to the spec.
   */
  or(clause: string): OrStep;
}

/**
 * After a where clause an `AND` or `OR` clause may be added.
 */
interface WhereStep extends AndStep, OrStep {}

/**
 * This is the implementation of the interfaces defined above.
 * It always returns an abstraction of itself to provide a ordered query specification flow.
 */
class QueryBuilderStep implements SelectStep, WhereStep {
  constructor(private spec: QuerySpec) {}

  from(clause: FlureeFromClause): FromStep {
    this.spec.from = clause;
    return this;
  }

  where(clause: string): WhereStep {
    this.spec.where = [clause];
    return this;
  }

  and(clause: string): AndStep {
    this.spec.where.push(clause);
    this.spec.whereOperator = 'AND';
    return this;
  }

  or(clause: any): OrStep {
    this.spec.where.push(clause);
    this.spec.whereOperator = 'OR';
    return this;
  }

  limit(limit: number): OptionsStep {
    const options = this.getOptions();
    options.limit = limit;
    return this;
  }

  offset(offset: number): OptionsStep {
    const options = this.getOptions();
    options.offset = offset;
    return this;
  }

  orderBy(orderBy: FlureeOrderClause): OptionsStep {
    const options = this.getOptions();
    options.orderBy = orderBy;
    return this;
  }

  options(options: FlureeQueryOptions): OptionsStep {
    this.spec.opts = options;
    return this;
  }

  build(): QuerySpec {
    return this.spec;
  }

  private getOptions(): FlureeQueryOptions {
    let opts = this.spec.opts;
    if (!opts) {
      opts = {};
      this.spec.opts = opts;
    }

    return opts;
  }
}

/**
 * Begins building a query specification with the given select predicates
 * @param predicate The first predicate to add to the list of selected predicates
 * @param predicates The rest of the predicates to add to the list of selected predicates
 * @returns A query builder at the select step
 */
export function select(
  predicate: PredicateNode,
  ...predicates: PredicateNode[]
): SelectStep {
  const spec: QuerySpec = {
    key: 'select',
    predicates: [predicate, ...predicates],
  };

  return new QueryBuilderStep(spec);
}

/**
 * Begins building a query specification with the given selectOne predicates
 * @param predicate The first predicate to add to the list of selected predicates
 * @param predicates The rest of the predicates to add to the list of selected predicates
 * @returns A query builder at the select step
 */
export function selectOne(
  predicate: PredicateNode,
  ...predicates: PredicateNode[]
): SelectStep {
  const spec: QuerySpec = {
    key: 'selectOne',
    predicates: [predicate, ...predicates],
  };

  return new QueryBuilderStep(spec);
}

export function ref(field: string, predicates: PredicateNode[]): ReferenceNode;
export function ref(
  field: string,
  predicates: PredicateNode[],
  opts?: ReferenceOptions
): ReferenceNode;

/**
 * Creates a reference select predicate.  This indicates the reference should be crawled rather
 * than just the _id of the reference being returned.
 * @param field The name of the reference field to crawl
 * @param predicates The predicates to pull from the reference field
 * @param opts The configuration and filtering options applied to the reference
 * @returns A query builder at the select step
 */
export function ref(
  field: string,
  predicates: PredicateNode[],
  opts?: ReferenceOptions
): ReferenceNode {
  return {
    field,
    predicates,
    opts,
  };
}
