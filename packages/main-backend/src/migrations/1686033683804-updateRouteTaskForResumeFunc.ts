import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteTaskForResumeFunc1686033683804 implements MigrationInterface {
  name = "UpdateRouteTaskForResumeFunc1686033683804";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" ADD \"lastCheckpointId\" uuid");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"lastCheckpointId\"");
  }

}
