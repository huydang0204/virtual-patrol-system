import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddTaskDailyReport1687247643553 implements MigrationInterface {
  name = "AddTaskDailyReport1687247643553";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("CREATE TABLE \"task_daily_report\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"siteId\" bigint NOT NULL DEFAULT '0', \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"taskReportData\" json DEFAULT '[]', CONSTRAINT \"PK_f14ebd40ba1b4a1d928bff14a6b\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("ALTER TABLE \"task_daily_report\" ADD CONSTRAINT \"FK_0c0490cc4ad62c1b4b471af8cfb\" FOREIGN KEY (\"siteId\") REFERENCES \"site\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_daily_report\" DROP CONSTRAINT \"FK_0c0490cc4ad62c1b4b471af8cfb\"");
    await queryRunner.query("DROP TABLE \"task_daily_report\"");
  }

}
