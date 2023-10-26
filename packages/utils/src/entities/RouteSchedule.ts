import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm";

import { Route } from "./Route";
import { DateOfWeek } from "../data";
import { ExecuteTime } from "../data";

@Entity()
export class RouteSchedule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({ type : "timestamptz" })
  public startOccurrenceDate! : Date;

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public endOccurrenceDate! : Date;

  @Column({
    type : "smallint",
    array : true,
    nullable : true
  })
  public executingDays! : DateOfWeek[];

  @Column({
    type : "json",
    nullable : true
  })
  public executingTime! : ExecuteTime[];

  @Column({
    type : "uuid",
    nullable : false
  })
  public routeId! : string;

  @ManyToOne(() => Route, (route : Route) => route.routeSchedules, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public route! : Route;
}
