import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { <%= classify(name) %> } from '../entities';
import { <%= classify(name) %>FlureeRepository } from '../repositories/fluree';
import { <%= classify(name) %>Dto } from '../dto';
import { <%= classify(name) %>DtoMap } from '../mappers/dto';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../cb.model';
<%_ } %>

@Resolver(() =>  <%= classify(name) %>)
export class <%= classify(name) %>Resolver {

  constructor(private repo: <%= classify(name) %>FlureeRepository, private mapper: <%= classify(name) %>DtoMap) {}

  @Query(() => [<%= classify(name) %>Dto])
  async <%= camelize(name) %>FindAll(): Promise<<%= classify(name) %>Dto[]> {
    return (await this.repo.findAll()).map((<%= camelize(name) %>: <%= classify(name) %>) =>
      this.mapper.fromEntity(<%= camelize(name) %>)
    )
  }

  @Query(() => [<%= classify(name) %>Dto])
  async <%= camelize(name) %>FindManyById(@Args ({ name: 'idList', type: () => ID }) idList: string[]): Promise<<%= classify(name) %>Dto[]> {
    return (await this.repo.findManyById(idList)).map((<%= camelize(name) %>: <%= classify(name) %>) =>
      this.mapper.fromEntity(<%= camelize(name) %>)
    )
  }

  @Query(() => Boolean)
  async <%= camelize(name) %>Exists(@Args ({ name: 'id', type: () => ID }) id: string): Promise<boolean> {
    return await this.repo.exists(id);
  }

  @Query(() => <%= classify(name) %>)
  async <%= camelize(name) %>findOneById(@Args({ name: 'id', type: () => ID }) id: string): Promise<<%= classify(name) %>Dto> {
    return this.mapper.fromEntity(
      await this.repo.findOneById(id)
    );
  }

  <% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
    @Query(() => [<%= classify(name) %>Dto])
    async <%= camelize(name) %>FindAllBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= p.type %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>): Promise<<%= classify(name) %>Dto[]> {
      return (await this.repo.findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>)).map((<%= camelize(p.name) %>: <%= classify(name) %>) =>
        this.mapper.fromEntity(<%= camelize(p.name) %>)
      )
    }
  <% }) %>

  <% definition.props.filter((p) => p.isUnique).map((p) => { -%>
    @Query(() => <%= classify(name) %>Dto)
    async <%= camelize(name) %>findOneBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= classify(p.type) %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>): Promise<<%= classify(name) %>Dto> {
      return this.mapper.fromEntity(
        await this.repo.findOneBy<%= classify(p.name) %>(name)
      );
    }
  <% }) %>

  @Mutation(() => <%= classify(name) %>Dto)
  async <%= camelize(name) %>Save(@Args({ name: '<%= camelize(name) %>', type: () => <%= classify(name) %>Dto }) <%= camelize(name) %>: <%= classify(name) %>Dto): Promise<<%= classify(name) %>Dto> {
    const <%= camelize(name) %>Entity = this.mapper.toEntity(<%= camelize(name) %>);
    return this.mapper.fromEntity(
      await this.repo.save(<%= camelize(name) %>Entity)
    );
  }

  @Mutation(() => Boolean)
  async <%= camelize(name) %>Delete(@Args({ name: 'id', type: () => ID }) id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }

}