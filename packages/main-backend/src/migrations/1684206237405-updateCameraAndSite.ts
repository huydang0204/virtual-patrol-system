import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateCameraAndSite1684206237405 implements MigrationInterface {
  name = "UpdateCameraAndSite1684206237405";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"siteId\" bigint NOT NULL DEFAULT '0'");
    await queryRunner.query("ALTER TABLE \"camera\" ADD CONSTRAINT \"FK_2f627983f65d4641a90a89fdf32\" FOREIGN KEY (\"siteId\") REFERENCES \"site\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera\" DROP CONSTRAINT \"FK_2f627983f65d4641a90a89fdf32\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"siteId\"");
  }

}
