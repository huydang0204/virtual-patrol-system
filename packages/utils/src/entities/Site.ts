import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Route } from "./Route";
import { Camera } from "./Camera";

@Entity()
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn({ type : "bigint" })
  public id! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public name! : string;

  @Column({
    length : 200,
    nullable : true
  })
  public description! : string;

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

  @OneToMany(() => Route, (route : Route) => route.id)
  public routes! : Route[];

  @OneToMany(() => Camera, (camera : Camera) => camera.site)
  public cameras! : Camera[];
}
