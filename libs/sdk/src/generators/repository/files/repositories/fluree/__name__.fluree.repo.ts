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
  FlureeClient } from '@logosphere/fluree';
import { RepositoryError } from '@logosphere/domain';
<% if (hasIndexedEnum(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../cb.model';
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
    const existing = await this.findOne(id);
    if (existing) {
      const transact = remove().id(+existing.subjectId).build();
      const response = await this.fluree.transact(transact);
      return response.status === 200;
    } else {
      return false;
    }
  } 

  public async findAll(): Promise<<%= classify(name) %>[]> {
    const query = select('*').from('<%= camelize(name) %>').build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
  }

  public async findMany(ids: string[]): Promise<<%= classify(name) %>[]> {
    
    if (!ids || ids.length === 0) {
      throw new RepositoryError('Empty array of ids for findMany method');
    }
    
    let query; 
    if (ids.length > 0) {
      query = select('*').where(`<%= camelize(name) %>/identifier = '${ids[0]}'`);
      if (ids.length > 1) {
        ids.shift();
        ids.map((id: string) => {
          query = query.or(`<%= camelize(name) %>/identifier = '${id}'`)
        })
      }
    }
    const fql = compile(query.build());
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f)); 
  }

  public async findOne(id: string): Promise<<%= classify(name) %>> {
    const query = selectOne('*').where(`<%= camelize(name) %>/identifier = '${id}'`).build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  }

  public async save(<%= camelize(name) %>: <%= classify(name) %>): Promise<<%= classify(name) %>> {
    let transact;
    const data = this.mapper.fromEntity(<%= camelize(name) %>);
    const existing = await this.findOne(<%= camelize(name) %>.id);
    if (existing) {
      data._id = +existing.subjectId;
      transact = update('<%= camelize(name) %>')
      .data(data).build();
    } else {
      data._id = `<%= camelize(name) %>$${data.id}`;
      transact = create('<%= camelize(name) %>')
      .data(data).build();
    }

    const response = await this.fluree.transact(transact);
    if (response.status === 200) {
      return await this.findOne(<%= camelize(name) %>.id);
    } else {
      return null;
    }
  }

<% definition.props.filter((p) => p.isUnique).map((p) => { -%>
  public async findOneBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %> ): Promise<<%= classify(name) %>>{
    const query = selectOne('*')
      .where(`<%= camelize(name) %>/<%= camelize(p.name) %> = '${<%= camelize(p.name) %>}'`)
      .build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  };
<% }) %>
<% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
  public async findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %> ): Promise<<%= classify(name)%>[]>{
    const query = select('*').where(`<%= camelize(name) %>/<%= camelize(p.name) %> = '${<%= camelize(p.name) %>}'`).build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    if (result && result.length > 0) {
      return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
    } else {
      return null;
    }
  };
<% }) %>

}
