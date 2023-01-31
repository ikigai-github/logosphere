/* eslint-disable @typescript-eslint/no-empty-interface */
import { Repository } from '@logosphere/sdk';
import { <%= classify(name) %> } from '../../entities';
<% if (hasIndexedEnum(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../<%= dasherize(module) %>.model';
<%_ } %>
export interface I<%= classify(name) %>Repository extends Repository<<%= classify(name) %>> {
  <% definition.props.filter((p) => p.isUnique).map((p) => { -%>
    findOneBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %> ): Promise<<%= classify(name) -%>>;
  <% }) -%>
  <% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
    findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %> ): Promise<<%= classify(name) -%>[]>;
  <% }) -%>
}