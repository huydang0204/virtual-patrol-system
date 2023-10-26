import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import { AlertTypePriority } from "../data";

@Entity()
export class AlertType extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({ length : 100 })
  public type! : string;

  @Column({
    length : 20,
    default : AlertTypePriority.Medium
  })
  public priority! : string;

  @Column({
    nullable : true,
    length : 300
  })
  public description! : string;

  @Column({
    type : "text",
    array : true,
    nullable : true
  })
  public actionTaken!: string[];

  @Column({ nullable : true })
  public imageUrl!: string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @UpdateDateColumn({ type : "timestamptz" })
  public updatedAt! : Date;

  @DeleteDateColumn({ type : "timestamptz" })
  public deletedAt! : Date;

}
