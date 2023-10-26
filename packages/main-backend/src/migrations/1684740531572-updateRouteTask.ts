import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteTask1684740531572 implements MigrationInterface {
  name = "UpdateRouteTask1684740531572";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\"");
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"status\"");
    await queryRunner.query("DROP TYPE \"public\".\"route_task_status_enum\"");
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "status" character varying(20) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD CONSTRAINT "FK_ec1c974cb1f2310de803bda0e58" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\"");
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"status\"");
    await queryRunner.query("CREATE TYPE \"public\".\"route_task_status_enum\" AS ENUM('Pending', 'OnGoing', 'Completed', 'Missed')");
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "status" "public"."route_task_status_enum" NOT NULL DEFAULT 'Pending'`);
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD CONSTRAINT "FK_ec1c974cb1f2310de803bda0e58" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
