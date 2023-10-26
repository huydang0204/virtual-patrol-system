import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";

import { Camera } from "./Camera";
import { SopType } from "../data";

@Entity()
export class Sop extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public id! : number;

  @Column({
    length : 100,
    nullable : true
  })
  public name! : string;

  @Column({
    length : 20,
    default : SopType.General
  })
  public type : SopType;

  @Column({
    type : "text",
    array : true,
    nullable : true
  })
  public checklists! : string[];

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public startDate! : Date;

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public endDate! : Date;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @DeleteDateColumn({ type : "timestamptz" })
  public deletedAt! : Date;

  @ManyToMany(() => Camera)
  @JoinTable({ name : "sop_cameras_camera" })
  public cameras! : Camera[];
}
