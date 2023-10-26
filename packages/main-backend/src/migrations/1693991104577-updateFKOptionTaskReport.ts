import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateFKOptionTaskReport1693991104577 implements MigrationInterface {
  name = "UpdateFKOptionTaskReport1693991104577";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query(`ALTER TABLE "task_report"
        ADD CONSTRAINT "FK_778b171fd411864312ad1367d1b" FOREIGN KEY ("id") REFERENCES "route_task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query(`ALTER TABLE "task_report"
        ADD CONSTRAINT "FK_778b171fd411864312ad1367d1b" FOREIGN KEY ("id") REFERENCES "route_task" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
