import { generateUUID } from '@/utils/uuidUtils';
import {AutoMap} from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export class EntityBase {
  constructor() {
    this.clientId = generateUUID();
  }
  @AutoMap()
  @Column({type: 'integer', nullable: true})
  id: number | null;

  @AutoMap()
  @PrimaryColumn()
  clientId: string;

  @AutoMap()
  @CreateDateColumn()
  createdDate: Date;

  @AutoMap()
  @UpdateDateColumn({
    nullable: true,
  })
  updatedDate?: Date | null;

  @AutoMap()
  @DeleteDateColumn({
    nullable: true,
  })
  deletedDate?: Date | null;
}
