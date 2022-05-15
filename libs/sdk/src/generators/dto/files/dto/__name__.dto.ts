<% dtoImports(definition).map((imp) => {-%>
import { <%= imp.name %> } from '<%= imp.file %>';
<%_ }) %>
export class  <%= classify(name) %>Dto {
	id?: string;
	subjectId?: number;
  <%_ definition.props.map((p) => { -%>
  <%= dtoProp(p).name %>: <%= dtoProp(p).type %>;
  <%_ }) -%>
}