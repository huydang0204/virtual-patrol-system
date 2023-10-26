import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne
} from "typeorm";

import { Camera } from "./Camera";
import { Route } from "./Route";

@Entity()
export class RouteCheckpoint extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({ type : "int" })
  public setOrder! : number;

  @Column({ type : "int" })
  public layoutRow! : number;

  @Column({ type : "int" })
  public layoutCol! : number;

  @Column({
    type : "uuid",
    nullable : false
  })
  public routeId! : string;

  @ManyToOne(() => Route, (route: Route) => route.routeCheckpoints, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public route! : Route;

  @ManyToMany(() => Camera)
  @JoinTable()
  public cameras! : Camera[];
}
