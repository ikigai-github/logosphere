import {
  PredicateNode,
  QueryContext,
  QueryFromClause,
  QueryOptions,
  QueryOrderClause,
  ReferenceNode,
  ReferenceOptions,
} from './query.schema';

interface BuildableStep {
  build(): QueryContext;
}

interface OptionsStep<T> extends BuildableStep {
  limit(limit: number): OptionsStep<T>;
  offset(offset: number): OptionsStep<T>;
  orderBy(orderBy: QueryOrderClause): OptionsStep<T>;
  options(options: QueryOptions): OptionsStep<T>;
}

interface SelectStep<T> {
  from(clause: QueryFromClause): FromStep<T>;
  where(clause: string): WhereStep<T>;
}

interface FromStep<T> extends OptionsStep<T> {
  where(clause: string): WhereStep<T>;
  limit(limit: number): OptionsStep<T>;
}

interface AndStep<T> extends OptionsStep<T> {
  and(clause: string): AndStep<T>;
}

interface OrStep<T> extends OptionsStep<T> {
  or(clause: string): OrStep<T>;
}

interface WhereStep<T> extends AndStep<T>, OrStep<T> {}

class QueryBuilderStep<T> implements SelectStep<T>, WhereStep<T> {
  constructor(private context: QueryContext) {}

  from(clause: QueryFromClause): FromStep<T> {
    this.context.from = clause;
    return this;
  }

  where(clause: string): WhereStep<T> {
    this.context.where = [clause];
    return this;
  }

  and(clause: string): AndStep<T> {
    this.context.where.push(clause);
    this.context.whereOperator = 'AND';
    return this;
  }

  or(clause: any): OrStep<T> {
    this.context.where.push(clause);
    this.context.whereOperator = 'OR';
    return this;
  }

  limit(limit: number): OptionsStep<T> {
    const options = this.getOptions();
    options.limit = limit;
    return this;
  }

  offset(offset: number): OptionsStep<T> {
    const options = this.getOptions();
    options.offset = offset;
    return this;
  }

  orderBy(orderBy: QueryOrderClause): OptionsStep<T> {
    const options = this.getOptions();
    options.orderBy = orderBy;
    return this;
  }

  options(options: QueryOptions): OptionsStep<T> {
    this.context.options = options;
    return this;
  }

  build(): QueryContext {
    return this.context;
  }

  private getOptions(): QueryOptions {
    let options = this.context.options;
    if (!options) {
      options = {};
      this.context.options = options;
    }

    return options;
  }
}

export function select<T = any>(
  ...predicates: PredicateNode[]
): QueryBuilderStep<T[]> {
  const context: QueryContext = {
    key: 'select',
    predicates,
  };

  return new QueryBuilderStep<T[]>(context);
}

export function selectOne<T = any>(
  ...predicates: PredicateNode[]
): QueryBuilderStep<T> {
  const context: QueryContext = {
    key: 'selectOne',
    predicates,
  };

  return new QueryBuilderStep<T>(context);
}

export function ref(field: string, predicates: PredicateNode[]): ReferenceNode;
export function ref(
  field: string,
  predicates: PredicateNode[],
  options?: ReferenceOptions
): ReferenceNode;

export function ref(
  field: string,
  predicates: PredicateNode[],
  options?: ReferenceOptions
): ReferenceNode {
  return {
    field,
    predicates,
    options,
  };
}
