import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  MoreThan,
  Repository,
} from 'typeorm';
import Db from '../dbSource';
import {EntityBase} from '../entity/_base';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity.js';

export class RepositoryBase<T extends EntityBase> extends Repository<T> {
  constructor(entityClass: EntityTarget<T>) {
    super(entityClass, Db.manager);
  }
  async getAll(options?: FindManyOptions<T>): Promise<T[]> {
    var data = this.find(options);
    return data;
  }
  async getByClientId(_clientId: string): Promise<T | null> {
    return await this.findOne({
      //@ts-ignore
      where: {
        clientId: _clientId,
      },
    });
  }
  async createOrUpdate(entity: T) {
    await this.save(entity);
  }
  async getChangesData(
    lastSyncDate: string,
    relations: FindOneOptions<T>['relations'] = [],
  ): Promise<T[]> {
    return this.find({
      //@ts-ignore
      where: [
        {
          updatedDate: MoreThan(lastSyncDate),
        },
        {
          createdDate: MoreThan(lastSyncDate),
        },
        {
          deletedDate: MoreThan(lastSyncDate),
        },
      ],
      relations: relations,
    });
  }
  async hasChangedData(lastGetSyncTime: string): Promise<boolean> {
    const result = await this.createQueryBuilder(this.metadata.tableName)
      .where(
        `${this.metadata.tableName}.createdDate > :lastGetSyncTime 
       OR ${this.metadata.tableName}.updatedDate > :lastGetSyncTime 
       OR ${this.metadata.tableName}.deletedDate > :lastGetSyncTime`,
        {lastGetSyncTime},
      )
      .getCount(); // Returns the count of records matching the condition

    return Promise.resolve(result > 0);
  }
  async insertAndGet(entity: T): Promise<T> {
    const returnData = await super.insert(entity as QueryDeepPartialEntity<T>);
    const data = await this.getByClientId(
      returnData.generatedMaps[0].clientId,
    )!;

    return data!;
  }
  async updateAndGet(partialEntity: T & {clientId: string}): Promise<T> {
    const cleanedEntity = removeUndefinedProps(partialEntity);
    await this.save(cleanedEntity);
    const data = await this.getByClientId(cleanedEntity.clientId)!;

    return data!;
  }
}
function removeUndefinedProps<T>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj as Object).filter(([_, value]) => value !== undefined),
  ) as T;
}

export default RepositoryBase;
