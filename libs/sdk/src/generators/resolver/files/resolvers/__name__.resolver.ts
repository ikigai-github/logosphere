/* eslint-disable @typescript-eslint/no-explicit-any */
import { Args, ID, Mutation, Query, Resolver, Info, Context } from '@nestjs/graphql';
<%_ if(definition.isNft) { -%>
import { MintService } from '@logosphere/cardano';
import { <%= classify(name) %>, Wallet, WalletAsset } from '../entities';
import { <%= classify(name) %>FlureeRepository,
  UserFlureeRepository,
  WalletFlureeRepository
} from '../repositories/fluree';
import { tx_prepare_json } from 'cbauth-logo-wasm';
<%_ } else { -%>
import { <%= classify(name) %> } from '../entities';
import { <%= classify(name) %>FlureeRepository } from '../repositories/fluree';
<%_ } -%>
import { LogosphereError } from '@logosphere/errors';
import { parseInfo } from '@logosphere/fluree';
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
    , private userRepo: UserFlureeRepository
    , private walletRepo: WalletFlureeRepository
    <%_ } -%>
  ) {}

  @Query(() => [<%= classify(name) %>Dto])
  async <%= camelize(name) %>FindAll(@Info() info: any): Promise<<%= classify(name) %>Dto[]> {
    return (await this.repo.findAll(parseInfo(info).info.selectionSetList)).map((<%= camelize(name) %>: <%= classify(name) %>) =>
      this.mapper.fromEntity(<%= camelize(name) %>)
    )
  }

  @Query(() => [<%= classify(name) %>Dto])
  async <%= camelize(name) %>FindManyById(@Args ({ name: 'idList', type: () => ID }) idList: string[], @Info() info: any): Promise<<%= classify(name) %>Dto[]> {
    return (await this.repo.findManyById(idList, parseInfo(info).info.selectionSetList)).map((<%= camelize(name) %>: <%= classify(name) %>) =>
      this.mapper.fromEntity(<%= camelize(name) %>)
    )
  }

  @Query(() => Boolean)
  async <%= camelize(name) %>Exists(@Args ({ name: 'id', type: () => ID }) id: string): Promise<boolean> {
    return await this.repo.exists(id);
  }

  @Query(() => <%= classify(name) %>)
  async <%= camelize(name) %>FindOneById(@Args({ name: 'id', type: () => ID }) id: string, @Info() info: any): Promise<<%= classify(name) %>Dto> {
    return this.mapper.fromEntity(
      await this.repo.findOneById(id, parseInfo(info).info.selectionSetList)
    );
  }

  @Query(() => <%= classify(name) %>)
  async <%= camelize(name) %>FindOneBySubjectId(@Args({ name: 'subjectId', type: () => String }) subjectId: string, @Info() info: any): Promise<<%= classify(name) %>Dto> {
    return this.mapper.fromEntity(
      await this.repo.findOneBySubjectId(subjectId, parseInfo(info).info.selectionSetList)
    );
  }

  <% definition.props.filter((p) => p.isIndexed && !p.isUnique).map((p) => { -%>
    @Query(() => [<%= classify(name) %>Dto])
    async <%= camelize(name) %>FindAllBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= classify(p.type) %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>, @Info() info: any): Promise<<%= classify(name) %>Dto[]> {
      return (await this.repo.findAllBy<%= classify(p.name) %>(<%= camelize(p.name) %>, parseInfo(info).info.selectionSetList)).map((<%= camelize(p.name) %>: <%= classify(name) %>) =>
        this.mapper.fromEntity(<%= camelize(p.name) %>)
      )
    }
  <% }) %>

  <% definition.props.filter((p) => p.isUnique).map((p) => { -%>
    @Query(() => <%= classify(name) %>Dto)
    async <%= camelize(name) %>FindOneBy<%= classify(p.name) %>(@Args({ name: '<%= camelize(p.name) %>', type: () => <%= classify(p.type) %> }) <%= camelize(p.name) %>: <%= entityProp(p).type %>, @Info() info: any): Promise<<%= classify(name) %>Dto> {
      return this.mapper.fromEntity(
        await this.repo.findOneBy<%= classify(p.name) %>(<%= camelize(p.name) %>, parseInfo(info).info.selectionSetList)
      );
    }
  <% }) %>

  @Mutation(() => <%= classify(name) %>Dto)
  async <%= camelize(name) %>Save(@Args({ name: '<%= camelize(name) %>', type: () => <%= classify(name) %>Dto }) <%= camelize(name) %>: <%= classify(name) %>Dto, @Info() info: any): Promise<<%= classify(name) %>Dto> {
    const <%= camelize(name) %>Entity = this.mapper.toEntity(<%= camelize(name) %>);
    return this.mapper.fromEntity(
      await this.repo.save(<%= camelize(name) %>Entity, parseInfo(info).info.selectionSetList)
    );
  }

  @Mutation(() => Boolean)
  async <%= camelize(name) %>Delete(@Args({ name: 'id', type: () => ID }) id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }

  <%_ if(definition.isNft) { %>
  @Mutation(() => <%= classify(name) %>Dto)
  async <%= camelize(name) %>MintNft(@Args({ name: '<%= camelize(name) %>', type: () => <%= classify(name) %>Dto }) <%= camelize(name) %>: <%= classify(name) %>Dto, @Info() info: any, @Context() context: any): Promise<<%= classify(name) %>Dto> {
    
    const headers = context.req.headers;
    if (! headers['username']) {
      throw new LogosphereError('No username header specified in the request');
    }

    const userHeader = headers['username'];

    const user =  await this.userRepo.findOneByUsername(userHeader, [
      'id',
      'username',
      'wallet',
      'wallet/id',
      'wallet/subjectId',
      'wallet/walletId',
      'wallet/assets',
      'wallet/assets/id',
      'wallet/assets/subjectId'
    ]);

    const <%= camelize(name) %>Entity = this.mapper.toEntity(<%= camelize(name) %>);
    const saved<%= classify(name) %> = await this.repo.save(<%= camelize(name) %>Entity, ['id', 'subjectId', 'createdAt', 'updatedAt']);

    const nft = {
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
          src: `ipfs://${<%= camelize(name) %>.nftIpfsCid}`,
        },
      ],
      logosphere: {
        ledgerId: process.env.FLUREE_LEDGER,
        subjectId: saved<%= classify(name) %>.subjectId
      }
    };

    const submittedNft = await this.mintService.mint(
      process.env.CARDANO_WALLET_ID, 
      process.env.CARDANO_WALLET_MNEMONIC, 
      nft
    );

    const updated<%= classify(name) %> =  <%= classify(name) %>.create(
      {
        ...saved<%= classify(name) %>.props, 
        nftCardanoTxId: submittedNft.txId 
      }
    ).getValue();

    await this.repo.save(updated<%= classify(name) %>, ['id', 'subjectId', 'nftCardanoTxId', 'createdAt', 'updatedAt'])
    
    const asset = WalletAsset.create({
      name: nft.assetName,
      policyId: submittedNft.policyId,
      quantity: 1,
      metadata: JSON.stringify({...nft, entity: <%= camelize(name) %> }),
      assetSubjectId: saved<%= classify(name) %>.subjectId,
       logosphereId: saved<%= classify(name) %>.id
    }).getValue();

    const updatedAssets = user.wallet.assets ? user.wallet.assets : [];

    updatedAssets.push(asset);

    const updatedWallet = Wallet.create({ ...user.wallet.props, assets: updatedAssets}).getValue();

    await this.walletRepo.save(updatedWallet);

    return this.mapper.fromEntity(
      await this.repo.findOneById(updated<%= classify(name) %>.id, parseInfo(info).info.selectionSetList)
    );
  }

  @Mutation(() => String)
  async <%= camelize(name) %>MintNftTx(@Args({ name: '<%= camelize(name) %>', type: () => <%= classify(name) %>Dto }) <%= camelize(name) %>: <%= classify(name) %>Dto, @Info() info: any, @Context() context: any): Promise<string> {
    const <%= camelize(name) %>Entity = this.mapper.toEntity(<%= camelize(name) %>);
    const saved<%= classify(name) %> = await this.repo.save(<%= camelize(name) %>Entity, ['id', 'subjectId', 'createdAt', 'updatedAt']);

    const headers = context.req.headers;
    if (! headers['username']) {
      throw new LogosphereError('No username header specified in the request');
    }

    const userHeader = headers['username'];

    const user =  await this.userRepo.findOneByUsername(userHeader, [
      'id',
      'username',
      'wallet',
      'wallet/id',
      'wallet/subjectId',
      'wallet/walletId',
      'wallet/assets',
      'wallet/assets/id',
      'wallet/assets/subjectId'
    ]);


    if (! (user.wallet && user.wallet.walletId)) {
      throw new LogosphereError(`Wallet ID not found for user ${userHeader}`)
    }

    const nft = {
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
          src: `ipfs://${<%= camelize(name) %>.nftIpfsCid}`,
        },
      ],
      logosphere: {
        ledgerId: process.env.FLUREE_LEDGER,
        subjectId: saved<%= classify(name) %>.subjectId
      },
    }

    const tx = await this.mintService.buildTx(
      user.wallet.walletId,
      nft
    );

    const asset = WalletAsset.create({
      name: nft.assetName,
      policyId: tx.tokens[0].asset.policy_id,
      quantity: 1,
      metadata: JSON.stringify({...nft, entity: '<%= camelize(name) %>' }),
      assetSubjectId: saved<%= classify(name) %>.subjectId,
       logosphereId: saved<%= classify(name) %>.id
    }).getValue();

    const updatedAssets = user.wallet.assets ? user.wallet.assets : [];

    updatedAssets.push(asset);
  
    const updatedWallet = Wallet.create({ ...user.wallet.props, assets: updatedAssets}).getValue();
  
    await this.walletRepo.save(updatedWallet);
  
    console.log(`Tx: ${JSON.stringify(tx, null, 2)}`);
  
    const txReduced = tx_prepare_json(JSON.stringify(tx));
      
    return txReduced;
  }
  <%_ } -%>



}