import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class AddTaskMonthlyReport1687168330871 implements MigrationInterface {
  name = "AddTaskMonthlyReport1687168330871";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE \"task_monthly_report\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"siteId\" bigint NOT NULL DEFAULT '0', \"taskCount\" json DEFAULT '{}', \"taskStatusRecord\" json DEFAULT '{}', \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_c64d550ff23277cd3b6e88215d2\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" ADD CONSTRAINT \"FK_89323b8f21d717c628905751bce\" FOREIGN KEY (\"siteId\") REFERENCES \"site\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_monthly_report\" DROP CONSTRAINT \"FK_89323b8f21d717c628905751bce\"");
    await queryRunner.query("DROP TABLE \"task_monthly_report\"");
  }

}
