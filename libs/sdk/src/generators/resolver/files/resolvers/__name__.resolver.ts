import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
<%_ if(definition.isNft) { -%>
  import { MintService } from '@logosphere/cardano';
<%_ } -%>
import { <%= classify(name) %> } from '../entities';
import { <%= classify(name) %>FlureeRepository } from '../repositories/fluree';
import { <%= classify(name) %>Dto } from '../dto';
import { <%= classify(name) %>DtoMap } from '../mappers/dto';
<% if (isEnumImport(definition)) { -%>
  import {
    <% enumImports(definition).map((imp) => {-%>
    <%= imp %>,
    <%_ }) %>
  } from '../<%= dasherize(module) %>.model';
<%_ } %>

@Resolver(() =>  <%= classify(name) %>)
export class <%= classify(name) %>Resolver {

  constructor(
    private repo: <%= classify(name) %>FlureeRepository, 
    private mapper: <%= classify(name) %>DtoMap
    <%_ if(definition.isNft) { -%>
    , private mintService: MintService
    <%_ } -%>
  ) {}

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
  async <%= camelize(name) %>FindOneById(@Args({ name: 'id', type: () => ID }) id: string): Promise<<%= classify(name) %>Dto> {
    return this.mapper.fromEntity(
      await this.repo.findOneById(id)
    );
  }

  @Query(() => <%= classify(name) %>)
  async <%= camelize(name) %>FindOneBySubjectId(@Args({ name: 'subjectId', type: () => String }) subjectId: string): Promise<<%= classify(name) %>Dto> {
    return this.mapper.fromEntity(
      await this.repo.findOneBySubjectId(subjectId)
    );
  }

  <% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
    @Query(() => [<%= classify(name) %>Dto])
    async <%= camelize(name) %>FindAllBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= classify(p.type) %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>): Promise<<%= classify(name) %>Dto[]> {
      return (await this.repo.findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>)).map((<%= camelize(p.name) %>: <%= classify(name) %>) =>
        this.mapper.fromEntity(<%= camelize(p.name) %>)
      )
    }
  <% }) %>

  <% definition.props.filter((p) => p.isUnique).map((p) => { -%>
    @Query(() => <%= classify(name) %>Dto)
    async <%= camelize(name) %>FindOneBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= classify(p.type) %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>): Promise<<%= classify(name) %>Dto> {
      return this.mapper.fromEntity(
        await this.repo.findOneBy<%= classify(p.name) %>(<%= camelize(p.name) %>)
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

  <%_ if(definition.isNft) { %>
  @Mutation(() => <%= classify(name) %>Dto)
  async <%= camelize(name) %>MintNft(@Args({ name: '<%= camelize(name) %>', type: () => <%= classify(name) %>Dto }) <%= camelize(name) %>: <%= classify(name) %>Dto): Promise<<%= classify(name) %>Dto> {
    const <%= camelize(name) %>Entity = this.mapper.toEntity(<%= camelize(name) %>);
    const saved<%= classify(name) %> = await this.repo.save(<%= camelize(name) %>Entity);

    const submittedNft = await this.mintService.mint(
      process.env.CARDANO_WALLET_ID, 
      process.env.CARDANO_WALLET_MNEMONIC, {
      name: <%= camelize(name) %>.nftName,
      description: <%= camelize(name) %>.nftDescription,
      assetName: <%= camelize(name) %>.nftAssetName,
      standard: '721',
      mediaType: 'image/*',
      version: '1.0',
      thumbnailIpfsCid: `ipfs://${<%= camelize(name) %>.nftIpfsCid}`, 
      files: [
        {
          name: <%= camelize(name) %>.nftName,
          mediaType: 'image/*',
          src: `ipfs://${bison.nftIpfsCid}`,
        },
      ],
      logosphere: {
        ledgerId: process.env.FLUREE_LEDGER,
        subjectId: saved<%= classify(name) %>.subjectId
      },
    });
    
    return this.mapper.fromEntity(
      <%= classify(name) %>.create(
        {
          ...saved<%= classify(name) %>.props, 
          nftCardanoTxId: submittedNft.txId 
        }
      ).getValue()
    );
  }
  <%_ } -%>



}