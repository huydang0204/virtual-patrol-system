import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne
} from "typeorm";

import { Site } from "./Site";

import { DEFAULT_BIGINT_ID } from "../data";
import { TaskDailyReportData } from "../data";

@Entity()
export class TaskDailyReport extends BaseEntity {
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

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @Column({
    type : "json",
    nullable : true,
    default : []
  })
  public taskReportData : TaskDailyReportData[];

}
