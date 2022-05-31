import { FileSystemReader } from '@logosphere/readers';
import { gqlExec } from '@logosphere/utils';
import { ID } from '@nestjs/graphql';
import { <%= classify(name) %>Dto,
  <% if (hasIndexedEnum(definition)) { -%>
    enumTypes
  <%_ } %>
} from '@<%= npmScope %>/codegen-<%= dasherize(module) %>';

describe('<%= name %> E2E test', () => {

  let reader: FileSystemReader;
  let <%= camelize(name) %>: <%= classify(name) %>Dto; 
  let <%= camelize(name) %>Id: string;
  let <%= camelize(name) %>SubjectId: string;
 
  beforeAll(async () => {
    reader = new FileSystemReader(`${__dirname}/gql`);
    <%= camelize(name) %> =  <%- dtoDataFixture(index, definition.name, 1, true) %>
  });

  it('should create <%= name %>', async () => {
    const <%= camelize(name) %>Create = reader.read('mutations/<%= dasherize(name) %>-create.gql');
    const response = await gqlExec(<%= camelize(name) %>Create, { <%= camelize(name) %> });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>Save).toBeDefined();
    const ret = response.data.<%= camelize(name) %>Save;
    expect(ret.id).toBeDefined();
    <%= camelize(name) %>Id = Object.freeze(ret.id);
    expect(ret.subjectId).toBeDefined();
    <%= camelize(name) %>SubjectId = Object.freeze(ret.subjectId);
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  }, 300000);

  it('should update <%= name %>', async () => {
    const <%= camelize(name) %>Update = reader.read('mutations/<%= dasherize(name) %>-update.gql');
    const response = await gqlExec(<%= camelize(name) %>Update, {<%= camelize(name) %>: { id: <%= camelize(name) %>Id, ...<%= camelize(name) %> }});
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>Save).toBeDefined();
    const ret = response.data.<%= camelize(name) %>Save;
    expect(ret.id).toBeDefined();
    expect(ret.subjectId).toBeDefined();
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  }, 300000);

  it('should find <%= name %> all', async () => {
    const <%= camelize(name) %>FindAll = reader.read('queries/<%= dasherize(name) %>-find-all.gql');
    const response = await gqlExec(<%= camelize(name) %>FindAll);
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindAll).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindAll).toHaveLength(1);
    const ret = response.data.<%= camelize(name) %>FindAll[0];
    expect(ret.subjectId).toBeDefined();
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  });

  it('should check if <%= name %> exists', async () => {
    const <%= camelize(name) %>Exists = reader.read('queries/<%= dasherize(name) %>-exists.gql');
    const response = await gqlExec(<%= camelize(name) %>Exists, { id: <%= camelize(name) %>Id });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>Exists).toBeDefined();
    const ret = response.data.<%= camelize(name) %>Exists;
    expect(ret).toBeTruthy();
  });

  it('should find one <%= name %> by id', async () => {
    const <%= camelize(name) %>FindOneById = reader.read('queries/<%= dasherize(name) %>-find-one-by-id.gql');
    const response = await gqlExec(<%= camelize(name) %>FindOneById, { id: <%= camelize(name) %>Id });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindOneById).toBeDefined();
    const ret = response.data.<%= camelize(name) %>FindOneById;
    expect(ret.subjectId).toBeDefined();
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  });

  it('should find one <%= name %> by subject id', async () => {
    const <%= camelize(name) %>FindOneBySubjectId = reader.read('queries/<%= dasherize(name) %>-find-one-by-subject-id.gql');
    const response = await gqlExec(<%= camelize(name) %>FindOneBySubjectId, { subjectId: <%= camelize(name) %>SubjectId });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindOneBySubjectId).toBeDefined();
    const ret = response.data.<%= camelize(name) %>FindOneBySubjectId;
    expect(ret.subjectId).toBeDefined();
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  });

  it('should find many <%= name %> by id', async () => {
    const <%= camelize(name) %>FindManyById = reader.read('queries/<%= dasherize(name) %>-find-many-by-id.gql');
    const response = await gqlExec(<%= camelize(name) %>FindManyById, { idList: [<%= camelize(name) %>Id] });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindManyById).toBeDefined();
    expect(response.data.<%= camelize(name) %>FindManyById).toHaveLength(1);
    const ret = response.data.<%= camelize(name) %>FindManyById[0];
    expect(ret.subjectId).toBeDefined();
    expect(ret.createdAt).toBeDefined();
    expect(ret.updatedAt).toBeDefined();
    <%_ definition.props.map((p) => { -%>
        expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
    <%_ }) -%>
  });

  <% definition.props.filter((p) => p.isUnique).map((p) => { -%>
    it('should find one <%= name %> by <%= p.name %>', async () => {
      const <%= camelize(name) %>FindOneBy<%=classify(p.name)%> = `
      query <%= camelize(name) %>FindOneBy<%=classify(p.name)%>($<%= camelize(p.name) %>: <%= classify(p.type) %>!){
        <%= camelize(name) %>FindOneBy<%=classify(p.name)%>(<%= camelize(p.name) %>: $<%= camelize(p.name) %>){
          id,
          subjectId,
          <%_ definition.props.filter((p) => p.defType !== 'Entity' && p.defType !== 'EntityArray').map((p) => { -%>
          <%= camelize(p.name) %>,
          <%_ }) -%>
          createdAt,
          updatedAt
        }
      }
      `;
      const response = await gqlExec(<%= camelize(name) %>FindOneBy<%=classify(p.name)%>, { <%= camelize(p.name) %>: <%= camelize(name) %>.<%= camelize(p.name) %> });
      expect(response.data).toBeDefined();
      expect(response.data.<%= camelize(name) %>FindOneBy<%=classify(p.name)%>).toBeDefined();
      const ret = response.data.<%= camelize(name) %>FindOneBy<%=classify(p.name)%>;
      expect(ret.subjectId).toBeDefined();
      expect(ret.createdAt).toBeDefined();
      expect(ret.updatedAt).toBeDefined();
      <%_ definition.props.map((p) => { -%>
          expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
      <%_ }) -%>
    });
    
  <% }) %>

  <% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
    it('should find all <%= name %> by <%= p.name %>', async () => {
      const <%= camelize(name) %>FindAllBy<%=classify(p.name)%> = `
      query <%= camelize(name) %>FindAllBy<%=classify(p.name)%>($<%= camelize(p.name) %>: <%= classify(p.type) %>!){
        <%= camelize(name) %>FindAllBy<%=classify(p.name)%>(<%= camelize(p.name) %>: $<%= camelize(p.name) %>){
          id,
          subjectId,
          <%_ definition.props.filter((p) => p.defType !== 'Entity' && p.defType !== 'EntityArray').map((p) => { -%>
          <%= camelize(p.name) %>,
          <%_ }) -%>
          createdAt,
          updatedAt
        }
      }
      `;
      const response = await gqlExec(<%= camelize(name) %>FindAllBy<%=classify(p.name)%>, { <%= camelize(p.name) %>: <%= camelize(name) %>.<%= camelize(p.name) %> });
      expect(response.data).toBeDefined();
      expect(response.data.<%= camelize(name) %>FindAllBy<%=classify(p.name)%>).toBeDefined();
      expect(response.data.<%= camelize(name) %>FindAllBy<%=classify(p.name)%>).toHaveLength(1);
      const ret = response.data.<%= camelize(name) %>FindAllBy<%=classify(p.name)%>[0];
      expect(ret.subjectId).toBeDefined();
      expect(ret.createdAt).toBeDefined();
      expect(ret.updatedAt).toBeDefined();
      <%_ definition.props.map((p) => { -%>
          expect(ret.<%= p.name %>).<%= assert(p) %>(<%= camelize(name) %>.<%=p.name %>);
      <%_ }) -%>
    });
      
  <% }) %>

  it('should delete <%= name %>', async () => {
    const <%= camelize(name) %>Delete = reader.read('mutations/<%= dasherize(name) %>-delete.gql');
    const response = await gqlExec(<%= camelize(name) %>Delete, { id: <%= camelize(name) %>Id });
    expect(response.data).toBeDefined();
    expect(response.data.<%= camelize(name) %>Delete).toBeDefined();
    const ret = response.data.<%= camelize(name) %>Delete;
    expect(ret).toBeTruthy();
  }, 300000);


});