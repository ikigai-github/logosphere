/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from "@nestjs/common";
import { 
  compile, 
  ref, 
  select, 
  selectOne,
  create, 
  update, 
  remove, 
  FlureeSingleObject,
  FlureeClient,
  gqlSelectionSetToFql,
  processUpdateTransactSpec,
  reconcileArrays
} from '@logosphere/fluree';
import { copySubjectId } from '@logosphere/utils';
import { RepositoryError } from '@logosphere/domain';
<% if (hasIndexedEnum(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../<%= dasherize(module) %>.model';
<%_ } %>
import { <%= classify(name) %> } from '../../entities';
import { <%= classify(name) %>FlureeMap } from '../../mappers/fluree';
import { I<%= classify(name) %>Repository } from '../interfaces';

@Injectable()
export class <%= classify(name) %><%= classify(type) %>Repository implements I<%= classify(name) %>Repository {
  constructor(
    private fluree: FlureeClient,
    private mapper: <%= classify(name) %>FlureeMap
  ){}

  public async exists(id: string): Promise<boolean> {
    const query = selectOne('<%= camelize(name) %>/identifier').where(`<%= camelize(name) %>/identifier = '${id}'`).build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    return !!result && result['<%= camelize(name) %>/identifier'] === id;
  }

  public async delete(id: string): Promise<boolean> {
    const existing = await this.findOneById(id);
    if (existing) {
      const transact = remove().id(+existing.subjectId).build();
      const response = await this.fluree.transact(transact);
      return response.status === 200;
    } else {
      return false;
    }
  } 

  public async findAll(selectionSetList?: string[]): Promise<<%= classify(name) %>[]> {
    const select = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*']; 
    const fql = {
      select,
      from: '<%= camelize(name) %>'
    };
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
  }

  public async findManyById(idList: string[], selectionSetList?: string[]): Promise<<%= classify(name) %>[]> {
    
    if (!idList || idList.length === 0) {
      throw new RepositoryError('Empty array of ids for findManyById method');
    }
    
    let spec; 
    if (idList.length > 0) {
      spec = select('*').where(`<%= camelize(name) %>/identifier = '${idList[0]}'`);
      if (idList.length > 1) {
        idList.shift();
        idList.map((id: string) => {
          spec = spec.or(`<%= camelize(name) %>/identifier = '${id}'`)
        })
      }
    }
    const fql = compile(spec.build());
    fql.select = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*'];
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f)); 
  }

  public async findOneById(id: string, selectionSetList?: string[]): Promise<<%= classify(name) %>> {
    const spec = selectOne('*').where(`<%= camelize(name) %>/identifier = '${id}'`).build();
    const fql = compile(spec);
    fql.selectOne = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*'];
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  }

  public async findOneBySubjectId(subjectId: string, selectionSetList?: string[]): Promise<<%= classify(name) %>> {
    const spec = selectOne('*').from(+subjectId).build();
    const fql = compile(spec);
    fql.selectOne = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*'];
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  }

  public async save(<%= camelize(name) %>: <%= classify(name) %>, selectionSetList?: string[]): Promise<<%= classify(name) %>> {
    let spec;
    const data = this.mapper.fromEntity(<%= camelize(name) %>);
    const existing = await this.findOneById(<%= camelize(name) %>.id, selectionSetList);
    if (existing) {
      const existingData = this.mapper.fromEntity(existing);
      const resolvedData = copySubjectId(existingData, data, 'identifier', '_id');

      const updateTransact = [];
      const createTransact = [];

      processUpdateTransactSpec(update('<%= camelize(name) %>').data(resolvedData).build(), updateTransact, createTransact);

      if (createTransact.length > 0) {
        const response = await this.fluree.transact(
          createTransact
        );

        if (response.status === 200) {
          console.log('Dependent create transaction has completed successfully');
        } else {
          console.log('Dependent create transaction failed');
          console.log(JSON.stringify(createTransact, null, 2));
        }
      }
      
      const existingSpec = [];
      processUpdateTransactSpec(update('<%= camelize(name) %>').data(existingData).build(), existingSpec);
      spec = reconcileArrays(updateTransact, existingSpec);
    } else {
      data._id = `<%= camelize(name) %>$${<%= camelize(name) %>.id}`;
      spec = create('<%= camelize(name) %>')
      .data(data).build();
    }

    const response = await this.fluree.transact(JSON.parse(JSON.stringify(spec)));
    if (response.status === 200) {
      return await this.findOneById(<%= camelize(name) %>.id, selectionSetList);
    } else {
      console.log('Transaction failed');
      console.log(JSON.stringify(spec, null, 2));
      return null;
    }
  }

<% definition.props.filter((p) => p.isUnique).map((p) => { -%>
  public async findOneBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %>, selectionSetList?: string[]): Promise<<%= classify(name) %>>{
    const query = selectOne('*')
      .where(`<%= camelize(name) %>/<%= camelize(p.name) %> = '${<%= camelize(p.name) %>}'`)
      .build();
    const fql = compile(query);
    fql.selectOne = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*'];
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  };
<% }) %>
<% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
  public async findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %>, selectionSetList?: string[] ): Promise<<%= classify(name)%>[]>{
    const query = select('*').where(`<%= camelize(name) %>/<%= camelize(p.name) %> = '${<%= camelize(p.name) %>}'`).build();
    const fql = compile(query);
    fql.select = selectionSetList ? gqlSelectionSetToFql(selectionSetList) : ['*'];
    const result = await this.fluree.query(fql);
    if (result && result.length > 0) {
      return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
    } else {
      return null;
    }
  };
<% }) %>

}
