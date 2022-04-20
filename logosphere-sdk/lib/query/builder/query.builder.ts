import {
  FlureeOrderClause,
  FlureeQueryOptions,
  FlureeFromClause,
  ReferenceOptions,
} from '../fluree';
import { PredicateNode, QueryContext, ReferenceNode } from './query.schema';

interface BuildableStep {
  build(): QueryContext;
}

interface OptionsStep extends BuildableStep {
  limit(limit: number): OptionsStep;
  offset(offset: number): OptionsStep;
  orderBy(orderBy: FlureeOrderClause): OptionsStep;
  options(options: FlureeQueryOptions): OptionsStep;
}

interface SelectStep {
  from(clause: FlureeFromClause): FromStep;
  where(clause: string): WhereStep;
}

interface FromStep extends OptionsStep {
  where(clause: string): WhereStep;
  limit(limit: number): OptionsStep;
}

interface AndStep extends OptionsStep {
  and(clause: string): AndStep;
}

interface OrStep extends OptionsStep {
  or(clause: string): OrStep;
}

interface WhereStep extends AndStep, OrStep {}

class QueryBuilderStep implements SelectStep, WhereStep {
  constructor(private context: QueryContext) {}

  from(clause: FlureeFromClause): FromStep {
    this.context.from = clause;
    return this;
  }

  where(clause: string): WhereStep {
    this.context.where = [clause];
    return this;
  }

  and(clause: string): AndStep {
    this.context.where.push(clause);
    this.context.whereOperator = 'AND';
    return this;
  }

  or(clause: any): OrStep {
    this.context.where.push(clause);
    this.context.whereOperator = 'OR';
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
    this.context.opts = options;
    return this;
  }

  build(): QueryContext {
    return this.context;
  }

  private getOptions(): FlureeQueryOptions {
    let opts = this.context.opts;
    if (!opts) {
      opts = {};
      this.context.opts = opts;
    }

    return opts;
  }
}

export function select(...predicates: PredicateNode[]): SelectStep {
  const context: QueryContext = {
    key: 'select',
    predicates,
  };

  return new QueryBuilderStep(context);
}

export function selectOne(...predicates: PredicateNode[]): SelectStep {
  const context: QueryContext = {
    key: 'selectOne',
    predicates,
  };

  return new QueryBuilderStep(context);
}

export function ref(field: string, predicates: PredicateNode[]): ReferenceNode;
export function ref(
  field: string,
  predicates: PredicateNode[],
  opts?: ReferenceOptions
): ReferenceNode;

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
