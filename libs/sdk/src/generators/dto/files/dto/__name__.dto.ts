<% if (isEnumImport(definition)) { -%>
import {
  <% enumImports(definition).map((imp) => {-%>
  <%= imp %>,
  <%_ }) %>
} from '../enum-types';
<% } -%>
<% dtoImports(definition).map((imp) => {-%>
import { <%= imp.name %> } from '<%= imp.file %>';
<%_ }) %>
export class  <%= classify(name) %>Dto {
	id?: string;
	subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  <%_ definition.props.map((p) => { -%>
  <%= dtoProp(p).name %>: <%= dtoProp(p).type %>;
  <%_ }) -%>
}