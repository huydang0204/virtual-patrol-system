import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { UserPermissionRight } from "../data";

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({ length : 100 })
  public name! : string;

  @Column({ type : "text" })
  public description! : string;

  @Column({
    type : "json",
    nullable : true
  })
  public permissionRights : Record<UserPermissionRight, boolean>;

  @OneToMany(() => User, (user : User) => user.id)
  public users! : User[];
}
