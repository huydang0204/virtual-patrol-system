import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateAppNotiAddDetailData1687853657353 implements MigrationInterface {
  name = "UpdateAppNotiAddDetailData1687853657353";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"app_notification\" ADD \"detailData\" json");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"app_notification\" DROP COLUMN \"detailData\"");
  }

}
