/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common';
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
  reconcileArrays,
} from '@logosphere/fluree';
import { copySubjectId, RepositoryError } from '@logosphere/sdk';

import { WalletAsset } from '../../entities';
import { WalletAssetFlureeMap } from '../../mappers/fluree';
import { IWalletAssetRepository } from '../interfaces';

@Injectable()
export class WalletAssetFlureeRepository implements IWalletAssetRepository {
  constructor(
    private fluree: FlureeClient,
    private mapper: WalletAssetFlureeMap
  ) {}

  public async exists(id: string): Promise<boolean> {
    const query = selectOne('walletAsset/identifier')
      .where(`walletAsset/identifier = '${id}'`)
      .build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    return !!result && result['walletAsset/identifier'] === id;
  }

  public async delete(id: string): Promise<boolean> {
    const existing = await this.findOneById(id);
    if (existing) {
      const transact = remove()
        .id(+existing.subjectId)
        .build();
      const response = await this.fluree.transact(transact);
      return response.status === 200;
    } else {
      return false;
    }
  }

  public async findAll(selectionSetList?: string[]): Promise<WalletAsset[]> {
    const select = selectionSetList
      ? gqlSelectionSetToFql(selectionSetList)
      : ['*'];
    const fql = {
      select,
      from: 'walletAsset',
    };
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
  }

  public async findManyById(
    idList: string[],
    selectionSetList?: string[]
  ): Promise<WalletAsset[]> {
    if (!idList || idList.length === 0) {
      throw new RepositoryError('Empty array of ids for findManyById method');
    }

    let spec;
    if (idList.length > 0) {
      spec = select('*').where(`walletAsset/identifier = '${idList[0]}'`);
      if (idList.length > 1) {
        idList.shift();
        idList.map((id: string) => {
          spec = spec.or(`walletAsset/identifier = '${id}'`);
        });
      }
    }
    const fql = compile(spec.build());
    fql.select = selectionSetList
      ? gqlSelectionSetToFql(selectionSetList)
      : ['*'];
    const result = await this.fluree.query(fql);
    return result.map((f: FlureeSingleObject) => this.mapper.toEntity(f));
  }

  public async findOneById(
    id: string,
    selectionSetList?: string[]
  ): Promise<WalletAsset> {
    const spec = selectOne('*')
      .where(`walletAsset/identifier = '${id}'`)
      .build();
    const fql = compile(spec);
    fql.selectOne = selectionSetList
      ? gqlSelectionSetToFql(selectionSetList)
      : ['*'];
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  }

  public async findOneBySubjectId(
    subjectId: string,
    selectionSetList?: string[]
  ): Promise<WalletAsset> {
    const spec = selectOne('*')
      .from(+subjectId)
      .build();
    const fql = compile(spec);
    fql.selectOne = selectionSetList
      ? gqlSelectionSetToFql(selectionSetList)
      : ['*'];
    const result = await this.fluree.query(fql);
    if (result) {
      return this.mapper.toEntity(result);
    } else {
      return null;
    }
  }

  public async save(
    walletAsset: WalletAsset,
    selectionSetList?: string[]
  ): Promise<WalletAsset> {
    let spec;
    const data = this.mapper.fromEntity(walletAsset);
    const existing = await this.findOneById(walletAsset.id, selectionSetList);
    if (existing) {
      const existingData = this.mapper.fromEntity(existing);
      const resolvedData = copySubjectId(
        existingData,
        data,
        'identifier',
        '_id'
      );

      const updateTransact = [];
      const createTransact = [];

      processUpdateTransactSpec(
        update('walletAsset').data(resolvedData).build(),
        updateTransact,
        createTransact
      );

      if (createTransact.length > 0) {
        const response = await this.fluree.transact(createTransact);

        if (response.status === 200) {
          console.log(
            'Dependent create transaction has completed successfully'
          );
        } else {
          console.log('Dependent create transaction failed');
          console.log(JSON.stringify(createTransact, null, 2));
        }
      }

      const existingSpec = [];
      processUpdateTransactSpec(
        update('walletAsset').data(existingData).build(),
        existingSpec
      );
      spec = reconcileArrays(updateTransact, existingSpec);
    } else {
      data._id = `walletAsset$${walletAsset.id}`;
      spec = create('walletAsset').data(data).build();
    }

    const response = await this.fluree.transact(
      JSON.parse(JSON.stringify(spec))
    );
    if (response.status === 200) {
      return await this.findOneById(walletAsset.id, selectionSetList);
    } else {
      console.log('Transaction failed');
      console.log(JSON.stringify(spec, null, 2));
      return null;
    }
  }
}
