/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { Mapper, MapperError } from '@logosphere/domain';
import { <%= classify(name) %>Dto} from '../../dto';
import { 
  <%= classify(name) %>,
  <% entityImports(definition).map((imp) => {-%>
    <%= imp.name %>,
  <%_ }) %>
} from '../../entities';
<% if (isMapperImport(definition)) { -%>
  <% mapperImports(definition, type).map((imp) => {-%>
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
export class  <%= classify(name) %><%=classify(type)%>Map extends Mapper<<%= classify(name) %>> {
  public toEntity(data: <%= classify(name)%>Dto): <%= classify(name) %> {
    const <%= camelize(name) %>OrError = <%= classify(name) %>.create({
      id: data.id,
      subjectId: data.subjectId,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      <%_ definition.props.map((p) => { -%>
      <%= p.name %>: this.<%- mapperToEntity(p, type) %>, data['<%= p.name %>']),
      <%_ }) -%>
    });
    if (<%= camelize(name)  %>OrError.isSuccess) {
      return <%= camelize(name)  %>OrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(<%= camelize(name)  %>OrError.error));
    }
  }

  public fromEntity(<%= camelize(name) %>: <%= classify(name) %>): <%= classify(name) %>Dto {
    return {
      subjectId: <%= camelize(name) %>.subjectId,
      id: <%= camelize(name) %>.id,
      createdAt: <%= camelize(name) %>.createdAt.toISOString(),
      updatedAt: <%= camelize(name) %>.updatedAt.toISOString(),
      <%_ definition.props.map((p) => { -%>
      '<%= p.name %>': this.<%- mapperToData(p, type) %>, <%= camelize(name) %>.<%= p.name %>),
      <%_ }) -%>
    };
  }
}