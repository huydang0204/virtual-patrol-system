import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import {
  NotificationRelatedDataType,
  NotificationStatus,
  NotificationType
} from "../data";

@Entity()
export class AppNotification extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id! : string;

  @Column({ length : 30 })
  public type! : NotificationType;

  @Column({ length : 200 })
  public description! : string;

  @Column({
    type : "uuid",
    nullable : true
  })
  public alertedUserId! : string;

  @CreateDateColumn({ type : "timestamptz" })
  public createdAt! : Date;

  @Column({
    length : 20,
    default : NotificationStatus.New
  })
  public status! : NotificationStatus;

  @Column({
    type : "json",
    nullable : true
  })
  public detailData!: Record<NotificationRelatedDataType, unknown>;

}

