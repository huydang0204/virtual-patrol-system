import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn
} from "typeorm";

import {
  TaskStatus,
  TaskStatusRecord
} from "../data";
import { DEFAULT_BIGINT_ID } from "../data";
import { Site } from "./Site";

@Entity()
export class TaskMonthlyReport extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    type : "bigint",
    default : DEFAULT_BIGINT_ID
  })
  public siteId!: string;

  @ManyToOne(() => Site, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public site! : Site;

  @Column({
    type : "json",
    nullable : true,
    default : {}
  })
  public taskCounts : Record<TaskStatus, number>;

  @Column({
    type : "json",
    nullable : true,
    default : {}
  })
  public taskStatusRecords : Record<string, TaskStatusRecord[]>;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;
}

