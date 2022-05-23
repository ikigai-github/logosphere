/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from "@nestjs/common";
import { 
  compile, 
  ref, 
  select, 
  create, 
  update, 
  remove, 
  FlureeClient } from '@logosphere/fluree';
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
    const query = select('identifier').where(`<%= camelize(name) %>/identifier = '${id}'`).build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    return result.length > 0 &&
      result[0].identifier === id;
  }

  public async delete(id: string): Promise<boolean> {
    return false;
  } 

  public async findAll(): Promise<<%= classify(name) %>[]> {
    return [];
  }

  public async findMany(ids: string[]): Promise<<%= classify(name) %>[]> {
    return null;
  }

  public async findOne(id: string): Promise<<%= classify(name) %>> {
    const query = select('*').where(`<%= camelize(name) %>/identifier = '${id}'`).build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    if (result.length > 0) {
      return this.mapper.toEntity(result[0]);
    }
    else {
      return null
    }
  }

  public async save(<%= camelize(name) %>: <%= classify(name) %>): Promise<<%= classify(name) %>> {
    let transact;
    const data = this.mapper.fromEntity(<%= camelize(name) %>);
    const existing = await this.findOne(<%= camelize(name) %>.id);
    if (existing) {
      data.subjectId = existing.subjectId;
      transact = update('<%= camelize(name) %>')
      .data(data).build();
    } else {
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
    return null;
  };
<% }) %>
<% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
  public async findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>: <%= entityProp(p).type %> ): Promise<<%= classify(name)%>[]>{
    return null;
  };
<% }) %>

}
