import { <%= classify(name)%> } from '../../../entities/<%= dasherize(name) %>.entity';
import { <%= classify(name) %>Dto} from '../../../dto';
import { <%= classify(name)%><%= classify(type) %>Map } from '../<%= dasherize(name) %>.<%= dasherize(type) %>.map';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../../<%= dasherize(module) %>.model';
<%_ } %>
describe('<%= classify(name)%> <%= classify(type) %> Map', () => {
  let <%= camelize(name)%>Data: <%= classify(name) %>Dto;
  let <%= camelize(name)%>: <%= classify(name)%>;
  let mapper: <%= classify(name)%><%= classify(type) %>Map;
  beforeAll(() => {
    <%= camelize(name)%>Data = <%- dtoDataFixture(index, definition.name, fixtureDepth) %>
    mapper = new <%= classify(name)%><%= classify(type) %>Map();
  });

  it('should create <%= classify(name) %> entity from DTO data', () => {
    <%= camelize(name)%> = mapper.toEntity(<%= camelize(name)%>Data);
    expect(<%= camelize(name)%>.id).toBe('<%= dtoFx.ID %>');
    expect(<%= camelize(name)%>.subjectId).toBe('<%= dtoFx.SUBJECT_ID %>');
    expect(<%= camelize(name)%>.createdAt instanceof Date).toBeTruthy();
    expect(<%= camelize(name)%>.updatedAt instanceof Date).toBeTruthy();
    <%_ definition.props.map((p) => { -%>
      <% if (createExpect(p)) { -%>
        expect(<%= camelize(name)%>.<%= p.name %>).<%= assert(p) %>(<%- entityExample(p) %>);
      <% } -%>
    <%_ }) -%>
  });

  it('should serialize <%= classify(name) %> to DTO data', () => {
    const mappedData = mapper.fromEntity(<%= camelize(name)%>);
    expect(mappedData).toStrictEqual(<%= camelize(name)%>Data);
  });
});