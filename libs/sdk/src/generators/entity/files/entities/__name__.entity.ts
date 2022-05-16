import { Guard, Entity, EntityProps, Result } from '@logosphere/domain';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../cb.model';
<%_ } %>
<% entityImports(definition).map((imp) => {-%>
  import { <%= imp.name %> } from '<%= imp.file %>';
<%_ }) %>

interface <%= classify(name) %>Props extends EntityProps  {
  <%_ definition.props.map((p) => { -%>
  <%= entityProp(p).name %>: <%= entityProp(p).type %>;
  <%_ }) -%>
}

export class  <%= classify(name) %> extends Entity<<%= classify(name) %>Props> {
  <%_ definition.props.map((p) => { -%>
    get <%= p.name %>(): <%= entityProp(p).type %> {
      return this.props.<%= p.name %>;
    }
  <%_ }) -%>

  private constructor (props: <%= classify(name) %>Props) {
    super(props);
  }

  public static create (props: <%= classify(name) %>Props): Result<<%= classify(name) %>> {
    const propsResult = Guard.againstNullOrUndefinedBulk([
      <%_ definition.props.filter((p) => p.isRequired).map((p) => { -%>
      { argument: props.<%= p.name %>, argumentName: '<%= p.name %>' },
      <%_ }) -%>
    ]);

    if (!propsResult.succeeded) {
      return Result.fail<<%= classify(name) %>>(propsResult.message)
    } 

    const <%= camelize(name) %> = new <%= classify(name) %>(props);

    return Result.ok<<%= classify(name) %>>(<%= camelize(name) %>);
  }
}