import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./User";
import {
  ActivityType,
  NIL_UUID
} from "../data";

@Entity()
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    length : 30,
    nullable : false
  })
  public type! : ActivityType;

  @Column({
    type : "uuid",
    nullable : false,
    default : NIL_UUID
  })
  public userId! : string;

  @Column({ nullable : true })
  public description! : string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @ManyToOne(() => User, (user : User) => user.id, { onDelete : "CASCADE" })
  public user! : User;
}
