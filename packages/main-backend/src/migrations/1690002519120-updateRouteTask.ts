import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteTask1690002519120 implements MigrationInterface {
  name = "UpdateRouteTask1690002519120";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`ALTER TABLE "route_task"
        ADD "isNotified" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`UPDATE "route_task"
                             SET "isNotified" = false`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"isNotified\"");
  }

}
