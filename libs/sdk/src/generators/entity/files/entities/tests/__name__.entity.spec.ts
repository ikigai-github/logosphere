import { <%= classify(name)%> } from '../<%= dasherize(name) %>.entity';
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
describe('<%= classify(name)%> Entity', () => {

  let <%= camelize(name)%>: <%= classify(name)%>;
  beforeAll(() => {
    const result = <%= classify(name)%>.create({
      <%_ definition.props.filter((p) => p.isRequired).map((p) => { -%>
        <%= p.name %>: <%- example(p) %>,
      <%_ }) -%>
    });
    <%= camelize(name)%> = result.getValue();
  });

  it('should be defined', () => {
    expect(<%= camelize(name)%>).toBeDefined();
  });

  it('should have valid id', () => {
    expect(<%= camelize(name)%>.id).toBeDefined();
    expect(<%= camelize(name)%>.id).toHaveLength(64);
    expect(<%= camelize(name)%>.id).toMatch(/[A-Fa-f0-9]{64}/);
  });

  it('should have valid createdAt', () => {
    expect(<%= camelize(name)%>.createdAt).toBeDefined();
    expect(<%= camelize(name)%>.createdAt instanceof Date).toBeTruthy();
  });

  it('should have valid updatedAt', () => {
    expect(<%= camelize(name)%>.updatedAt).toBeDefined();
    expect(<%= camelize(name)%>.updatedAt instanceof Date).toBeTruthy();
  });

  <%_ definition.props.filter((p) => p.isRequired).map((p) => { -%>
  it('should have valid <%= p.name %>', () => {
    expect(<%= camelize(name)%>.<%= p.name %>).toBeDefined();
  });
  <%_ }) -%>
});