import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn
} from "typeorm";

import { RouteCheckpoint } from "./RouteCheckpoint";
import { RouteSchedule } from "./RouteSchedule";
import { Site } from "./Site";
import { User } from "./User";
import { RouteTask } from "./RouteTask";

import {
  DEFAULT_BIGINT_ID,
  DEFAULT_SECOND,
  NIL_UUID
} from "../data";
import { PatrolMode } from "../data";

@Entity()
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public name! : string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @Column({
    type : "boolean",
    default : false
  })
  public deleted!: boolean;

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public deletedAt!: Date;

  @Column({
    type : "uuid",
    nullable : false,
    default : NIL_UUID
  })
  public createdUserId! : string;

  @ManyToOne(() => User, (user : User) => user.id, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  @JoinColumn({ name : "createdUserId" })
  public createdUser! : User;

  @Column({
    type : "bigint",
    default : DEFAULT_BIGINT_ID
  })
  public siteId!: string;

  @Column({
    type : "int",
    default : DEFAULT_SECOND
  })
  public allowStartTime!: number;

  @Column({
    length : 20,
    default : PatrolMode.LiveImage
  })
  public patrolMode !: PatrolMode;

  @Column({
    type : "int",
    default : 1800 // 30 minutes
  })
  public reminderTime!: number;

  @ManyToOne(() => Site, (site : Site) => site.routes, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public site! : Site;

  @OneToMany(() => RouteCheckpoint, (routeCheckpoint : RouteCheckpoint) => routeCheckpoint.route)
  public routeCheckpoints! : RouteCheckpoint[];

  @OneToMany(() => RouteSchedule, (routeSchedule : RouteSchedule) => routeSchedule.route)
  public routeSchedules!: RouteSchedule[];

  @OneToMany(() => RouteTask, (task: RouteTask) => task.route)
  public tasks!: RouteTask[];

  @ManyToMany(() => User)
  @JoinTable()
  public assignedUsers! : User[];
}
