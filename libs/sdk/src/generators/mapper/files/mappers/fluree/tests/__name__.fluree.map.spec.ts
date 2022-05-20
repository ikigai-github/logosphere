import { <%= classify(name)%> } from '../../../entities/<%= dasherize(name) %>.entity';
import { <%= classify(name)%><%= classify(persistence) %>Map } from '../<%= dasherize(name) %>.<%= dasherize(persistence) %>.map';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../../cb.model';
<%_ } %>
describe('<%= classify(name)%> <%= classify(persistence) %> Map', () => {
  let <%= camelize(name)%>Data;
  let <%= camelize(name)%>: <%= classify(name)%>;
  let mapper: <%= classify(name)%><%= classify(persistence) %>Map;
  beforeAll(() => {
    <%= camelize(name)%>Data = <%- flureeDataFixture(index, definition.name, fixtureDepth) %>
    mapper = new <%= classify(name)%><%= classify(persistence) %>Map();
  });

  it('should create <%= classify(name) %> entity from Fluree data', () => {
    <%= camelize(name)%> = mapper.toEntity(<%= camelize(name)%>Data);
    expect(<%= camelize(name)%>.id).toBe('<%= fx.IDENTIFIER %>');
    expect(<%= camelize(name)%>.subjectId).toBe('<%= fx.SUBJECT_ID %>');
    expect(<%= camelize(name)%>.createdAt instanceof Date).toBeTruthy();
    expect(<%= camelize(name)%>.updatedAt instanceof Date).toBeTruthy();
    <%_ definition.props.map((p) => { -%>
      <% if (createExpect(p)) { -%>
        expect(<%= camelize(name)%>.<%= p.name %>).<%= assert(p) %>(<%- entityExample(p) %>);
      <% } -%>
    <%_ }) -%>
  });

  it('should serialize <%= classify(name) %> to Fluree data', () => {
    const mappedData = mapper.fromEntity(<%= camelize(name)%>);
    expect(mappedData).toStrictEqual(<%= camelize(name)%>Data);
  });
});