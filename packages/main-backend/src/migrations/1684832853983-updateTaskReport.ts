import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateTaskReport1684832853983 implements MigrationInterface {
  name = "UpdateTaskReport1684832853983";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("DROP TABLE \"checkpoint_report\"");
    await queryRunner.query(`CREATE TABLE "task_report"
                             (
                                 "id"             SERIAL                   NOT NULL,
                                 "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "reportDataRows" json,
                                 "taskId"         uuid                     NOT NULL,
                                 "siteId"         bigint                   NOT NULL,
                                 CONSTRAINT "PK_778b171fd411864312ad1367d1b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"comment\"");
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "startComment" character varying(300)`);
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "endComment" character varying(300)`);
    await queryRunner.query(`ALTER TABLE "task_report"
        ADD CONSTRAINT "FK_a4f3daa386160083aaf1a81ddc4" FOREIGN KEY ("taskId") REFERENCES "route_task" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_a4f3daa386160083aaf1a81ddc4\"");
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"endComment\"");
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"startComment\"");
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "comment" character varying(300)`);
    await queryRunner.query("DROP TABLE \"task_report\"");
  }

}
