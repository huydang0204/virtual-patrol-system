import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne
} from "typeorm";
import { Role } from "./Role";

import { SYSTEM_ROLE_ID } from "../data";
import { UserStatus } from "../data";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    length : 100,
    nullable : true
  })
  public nxWitnessId! : string;

  @Column({ nullable : true })
  public avatar! : string;

  @Column({ length : 100 })
  public name! : string;

  @Column({
    length : 128,
    unique : true
  })
  public email! : string;

  @Column({
    length : 5,
    nullable : true
  })
  public callingCode! : string;

  @Column({
    length : 20,
    nullable : true
  })
  public phoneNumber! : string;

  @Column({
    type : "uuid",
    default : SYSTEM_ROLE_ID.Officer
  })
  public roleId! : string;

  @Column({
    type : "text",
    nullable : true
  })
  public passwordHash! : string;

  @Column({ nullable : true })
  public latestLogin! : Date;

  @Column({ nullable : true })
  public latestChangePassword! : Date;

  @Column({
    type : "enum",
    enum : Object.values(UserStatus),
    default : UserStatus.active
  })
  public status! : string;

  @Column({ default : false })
  public isVerified! : boolean;

  @Column({
    type : "text",
    nullable : true
  })
  public blockingReason! : string | null;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @DeleteDateColumn({ type : "timestamptz" })
  public deletedAt! : Date;

  @ManyToOne(() => Role, (role : Role) => role.id, { cascade : true })
  public role! : Role;

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public blockedAt! : Date;

  @Column({
    type : "timestamptz",
    nullable : true
  })
  public reactivatedAt! : Date;
}
