import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class RenameTaskMonthlyReportCol1687344459578 implements MigrationInterface {
  name = "RenameTaskMonthlyReportCol1687344459578";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" RENAME COLUMN \"taskCount\" TO \"taskCounts\"");
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" RENAME COLUMN \"taskStatusRecord\" TO \"taskStatusRecords\"");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" RENAME COLUMN \"taskCounts\" TO \"taskCount\"");
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" RENAME COLUMN \"taskStatusRecords\" TO \"taskStatusRecord\"");
  }

}
