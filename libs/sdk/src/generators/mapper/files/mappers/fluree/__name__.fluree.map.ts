/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { Mapper } from '@logosphere/domain';
import { 
  <%= classify(name) %>,
  <% entityImports(definition).map((imp) => {-%>
    <%= imp.name %>,
  <%_ }) %>
} from '../../entities';
<% if (isMapperImport(definition)) { -%>
  <% mapperImports(definition, persistence).map((imp) => {-%>
  import { <%= imp.name %> } from '<%- imp.file %>';
  <%_ }) %>
<%_ } %>
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../../cb.model';
<%_ } %>


@Injectable()
export class  <%= classify(name) %><%=classify(persistence)%>Map extends Mapper<<%= classify(name) %>> {
  public toEntity(data: any): <%= classify(name) %> {
    const <%= camelize(name) %>OrError = <%= classify(name) %>.create({
      id: data['<%= camelize(name) %>/identifier'] || data.identifier,
      subjectId: String(data._id),
      createdAt: new Date(data['<%= camelize(name) %>/createdAt'] || data.createdAt),
      updatedAt: new Date(data['<%= camelize(name) %>/updatedAt'] || data.updatedAt),
      <%_ definition.props.map((p) => { -%>
      <%= p.name %>: this.<%- mapperToEntity(p, persistence) %>, data['<%= camelize(name) %>/<%= p.name %>'] || data.<%= p.name %>),
      <%_ }) -%>
    });
    <%= camelize(name) %>OrError.isFailure ? console.log(<%= camelize(name) %>OrError) : '';
    return  <%= camelize(name) %>OrError.isSuccess ?  <%= camelize(name) %>OrError.getValue() : null;
  }

  public fromEntity(<%= camelize(name) %>: <%= classify(name) %>): any {
    return {
      _id: Number(<%= camelize(name) %>.subjectId),
      '<%= camelize(name) %>/identifier': <%= camelize(name) %>.id,
      '<%= camelize(name) %>/createdAt': Number(<%= camelize(name) %>.createdAt),
      '<%= camelize(name) %>/updatedAt': Number(<%= camelize(name) %>.updatedAt),
      <%_ definition.props.map((p) => { -%>
      '<%= camelize(name) %>/<%= p.name %>': this.<%- mapperToData(p, persistence) %>, <%= camelize(name) %>.<%= p.name %>),
      <%_ }) -%>
    };
  }
}