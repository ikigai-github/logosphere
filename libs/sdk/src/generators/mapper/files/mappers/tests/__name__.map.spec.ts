import { <%= classify(name)%> } from '../../entities/<%= dasherize(name) %>.entity';
import { <%= classify(name)%>Map } from '../<%= dasherize(name) %>.map';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../cb.model';
<%_ } %>
<% entityImports(definition, '..').map((imp) => {-%>
  import { <%= imp.name %> } from '<%= imp.file %>';
<%_ }) %>
describe('<%= classify(name)%> Map', () => {
  let <%= camelize(name)%>Data;
  beforeAll(() => {
    <%= camelize(name)%>Data = {
      _id: 369435906932826,
      '<%= camelize(name) %>/identifier': '34b9142664b55f552ea66c8189ab481382d14385c126fee99a997b69e6b3824a',
      '<%= camelize(name) %>/createdAt': 1657773127808,
      '<%= camelize(name) %>/updatedAt': 1657773127808,
      <%_ definition.props.map((p) => { -%>
      '<%= camelize(name) %>/<%= entityProp(p).name %>':  <%- dataExample(p) %>,
      <%_ }) -%>
    }
  });

  it('should create <%= classify(name) %> entity from data', () => {
    const <%= camelize(name)%>: <%= classify(name)%> = <%= classify(name)%>Map.toEntity(<%= camelize(name)%>Data);
    expect(<%= camelize(name)%>.id).toBe('34b9142664b55f552ea66c8189ab481382d14385c126fee99a997b69e6b3824a');
    expect(<%= camelize(name)%>.subjectId).toBe('369435906932826');
    expect(<%= camelize(name)%>.createdAt instanceof Date).toBeTruthy();
    expect(<%= camelize(name)%>.updatedAt instanceof Date).toBeTruthy();
    <%_ definition.props.map((p) => { -%>
      expect(<%= camelize(name)%>.<%= p.name %>).toBe(<%- entityExample(p) %>);
    <%_ }) -%>
  });
});