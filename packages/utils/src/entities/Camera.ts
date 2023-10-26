import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  PrimaryColumn,
  ManyToOne,
  JoinTable
} from "typeorm";
import { RouteCheckpoint } from "./RouteCheckpoint";
import { Site } from "./Site";
import { Sop } from "./Sop";

import { CameraStatus } from "../data";
import { DEFAULT_BIGINT_ID } from "../data";

@Entity()
export class Camera extends BaseEntity {
  @PrimaryColumn({ type : "uuid" })
  public id! : string;

  @Column({ length : 100 })
  public name! : string;

  @Column({
    length : 300,
    nullable : true
  })
  public address! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public lat! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public lng! : string;

  @Column({
    length : 20,
    default : "offline"
  })
  public status! : CameraStatus;

  @Column({
    length : 100,
    nullable : true
  })
  public region! : string;

  @Column({
    type : "text",
    array : true,
    nullable : true
  })
  public tags! : string[];

  @Column({
    type : "bigint",
    default : DEFAULT_BIGINT_ID
  })
  public siteId!: string;

  @ManyToOne(() => Site, (site : Site) => site.cameras, {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  })
  public site! : Site;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @DeleteDateColumn({ type : "timestamptz" })
  public deletedAt! : Date;

  @ManyToMany(() => RouteCheckpoint)
  public routeCheckpoints! : RouteCheckpoint[];

  @ManyToMany(() => Sop)
  @JoinTable({ name : "sop_cameras_camera" })
  public sops! : Sop[];

  @Column({
    length : 100,
    nullable : true
  })
  public bearing! : string;
}
