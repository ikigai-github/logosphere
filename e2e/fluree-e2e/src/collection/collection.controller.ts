import { FlureeClient } from '@logosphere/fluree';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateCollectionRequest } from './collection.schema';

@Controller('collection')
export class CollectionController {
  constructor(private client: FlureeClient) {}

  @Post()
  public async createCollection(
    @Body() { name, doc, predicates }: CreateCollectionRequest
  ) {
    let tx = [];
    if (predicates && predicates.length > 0) {
      tx = predicates.map((pred) => ({
        _id: '_predicate',
        _action: 'add',
        name: `${name}/${pred.name}`,
        type: pred.type,
        doc: pred.doc,
      }));
    }

    tx.push({
      _id: '_collection',
      _action: 'add',
      name,
      doc,
    });

    return await this.client.transact(tx);
  }

  @Delete(':collection')
  public async deleteCollection(@Param('collection') collection: string) {
    this.client.query({ select: [''] });
    return await this.client.transact([
      {
        _id: ['_collection/name', collection],
        _action: 'delete',
      },
    ]);
  }
}
