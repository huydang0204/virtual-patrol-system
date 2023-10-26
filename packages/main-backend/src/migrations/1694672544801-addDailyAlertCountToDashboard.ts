import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddDailyAlertCountToDashboard1694672544801 implements MigrationInterface {
  name = "AddDailyAlertCountToDashboard1694672544801";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`ALTER TABLE "dashboard_analytics"
        ADD "dailyAlertCountAnalytics" json DEFAULT '[]'`);
    await queryRunner.query(`UPDATE "dashboard_analytics"
        SET "dailyAlertCountAnalytics"='[]'`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"dashboard_analytics\" DROP COLUMN \"dailyAlertCountAnalytics\"");
  }

}
