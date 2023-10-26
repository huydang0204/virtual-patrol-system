import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateTaskReport1686550876123 implements MigrationInterface {
  name = "UpdateTaskReport1686550876123";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("DELETE FROM \"task_report\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_a4f3daa386160083aaf1a81ddc4\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP COLUMN \"taskId\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"PK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP COLUMN \"id\"");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD \"id\" uuid NOT NULL");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"PK_778b171fd411864312ad1367d1b\" PRIMARY KEY (\"id\")");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"FK_778b171fd411864312ad1367d1b\" FOREIGN KEY (\"id\") REFERENCES \"route_task\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"PK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP COLUMN \"id\"");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD \"id\" SERIAL NOT NULL");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"PK_778b171fd411864312ad1367d1b\" PRIMARY KEY (\"id\")");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD \"taskId\" uuid NOT NULL");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"FK_a4f3daa386160083aaf1a81ddc4\" FOREIGN KEY (\"taskId\") REFERENCES \"route_task\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

}
