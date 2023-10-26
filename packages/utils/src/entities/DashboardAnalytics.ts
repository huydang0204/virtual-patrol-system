import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  ManyToOne
} from "typeorm";

import { TaskStatus } from "../data";
import { DEFAULT_BIGINT_ID } from "../data";
import { Site } from "./Site";

@Entity()
export class DashboardAnalytics extends BaseEntity {
  @PrimaryColumn({
    length : 50,
    unique : true
  })
  public id! : string;

  @PrimaryColumn({
    type : "bigint",
    default : DEFAULT_BIGINT_ID
  })
  public siteId! : string;

  @ManyToOne(() => Site, (site : Site) => site.id, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public site! : Site;

  @Column({
    type : "json",
    nullable : true,
    default : {}
  })
  public taskCountAnalytics! : Record<TaskStatus, number>;

  @Column({
    type : "json",
    nullable : true,
    default : {}
  })
  public alertCountAnalytics! : Record<string, number>;

  @Column({
    type : "json",
    nullable : true,
    default : []
  })
  public weeklyAlertCountAnalytics!: number[];

  @Column({
    type : "json",
    nullable : true,
    default : []
  })
  public dailyAlertCountAnalytics!: number[];

}
