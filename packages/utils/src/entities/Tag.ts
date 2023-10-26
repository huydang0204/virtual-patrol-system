import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Tag extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
  public id!: string;

	@Column({ length : 100 })
	public name!: string;

	@CreateDateColumn({ type : "timestamptz" })
	public createdAt!: Date;

	@UpdateDateColumn({ type : "timestamptz" })
	public updatedAt!: Date;
}
