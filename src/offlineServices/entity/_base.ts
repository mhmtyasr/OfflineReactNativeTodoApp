import {AutoMap} from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class EntityBase {
  @AutoMap()
  @Column({type: 'integer', nullable: true})
  id: number | null;

  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
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
