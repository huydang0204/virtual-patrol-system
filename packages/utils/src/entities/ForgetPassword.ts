import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity()
export class ForgetPassword extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({
    type : "uuid",
    nullable : false
  })
  public userId! : string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @ManyToOne(() => User)
  public user! : User;
}
