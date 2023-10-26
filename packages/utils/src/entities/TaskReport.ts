import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn
} from "typeorm";

import { RouteTask } from "./RouteTask";
import { TaskReportRowData } from "../data";

@Entity()
export class TaskReport extends BaseEntity {
  @PrimaryColumn({ type : "uuid" })
  public id! : string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @Column({
    type : "json",
    nullable : true
  })
  public reportDataRows : Record<number, TaskReportRowData[]>;
  // key: checkpoint set order

  @OneToOne(() => RouteTask, (task : RouteTask) => task.id, { onDelete : "CASCADE" })
  @JoinColumn({ name : "id" })
  public task! : RouteTask;

}
