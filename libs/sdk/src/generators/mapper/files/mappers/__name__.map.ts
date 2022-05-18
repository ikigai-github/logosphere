/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { Mapper } from '@logosphere/domain';
import { 
  <%= classify(name) %>,
  <% entityImports(definition).map((imp) => {-%>
    <%= imp.name %>,
  <%_ }) %>
} from '../entities';
<% if (isMapperImport(definition)) { -%>
  <% mapperImports(definition).map((imp) => {-%>
  import { <%= imp.name %> } from '<%- imp.file %>';
  <%_ }) %>
<%_ } %>
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../cb.model';
<%_ } %>


@Injectable()
export class  <%= classify(name) %>Map extends Mapper<<%= classify(name) %>> {
  public toEntity(data: any): <%= classify(name) %> {
    const <%= camelize(name) %>OrError = <%= classify(name) %>.create({
      id: data['<%= camelize(name) %>/identifier'] || data.identifier,
      subjectId: String(data._id),
      createdAt: new Date(data['<%= camelize(name) %>/createdAt'] || data.createdAt),
      updatedAt: new Date(data['<%= camelize(name) %>/updatedAt'] || data.updatedAt),
      <%_ definition.props.map((p) => { -%>
      <%= p.name %>: this.<%- mapperToEntity(p) %>, data['<%= camelize(name) %>/<%= p.name %>'] || data.<%= p.name %>),
      <%_ }) -%>
    });
    <%= camelize(name) %>OrError.isFailure ? console.log(<%= camelize(name) %>OrError) : '';
    return  <%= camelize(name) %>OrError.isSuccess ?  <%= camelize(name) %>OrError.getValue() : null;
  }

  public static toPersistence(<%= camelize(name) %>: <%= classify(name) %>): any {
    return {};
  }
}