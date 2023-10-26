import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToOne
} from "typeorm";

import { Route } from "./Route";
import { TaskStatus } from "../data";
import { TaskReport } from "./TaskReport";

// Task will be generated from Route Checkpoint and Route Schedule
@Entity()
export class RouteTask extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public name! : string;

  @Column({ type : "timestamptz" })
  public occurrenceDate! : Date;

  @Column({ type : "int" })
  public startTime! : number;

  @Column({ type : "int" })
  public endTime! : number;

  @Column({ length : 20 })
  public status! : TaskStatus;

  @Column({
    length : 300,
    nullable : true
  })
  public startComment! : string;

  @Column({
    length : 300,
    nullable : true
  })
  public endComment! : string;

  @Column({
    type : "uuid",
    nullable : true
  })
  public lastCheckpointId! : string;

  @Column({
    type : "uuid",
    nullable : true
  })
  public scheduleId! : string;

  @Column({
    type : "json",
    nullable : true,
    default : {}
  })
  public alertedCameraIds : Record<string, string[]>;

  @Column({ default : false })
  public isNotified! : boolean;

  @Column({
    type : "uuid",
    nullable : false
  })
  public routeId! : string;

  @ManyToOne(() => Route, (route : Route) => route.id)
  public route! : Route;

  @OneToOne(() => TaskReport, (report : TaskReport) => report.task)
  public taskReport!: TaskReport;

}
