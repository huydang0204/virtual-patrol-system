import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateTaskAddScheduleId1691550977372 implements MigrationInterface {
  name = "UpdateTaskAddScheduleId1691550977372";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" ADD \"scheduleId\" uuid");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"scheduleId\"");
  }

}
