import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteAddReminderTime1687851240460 implements MigrationInterface {
  name = "UpdateRouteAddReminderTime1687851240460";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" ADD \"reminderTime\" integer NOT NULL DEFAULT 1800");
    await queryRunner.query("UPDATE \"route\" SET \"reminderTime\" = 1800");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"reminderTime\"");
  }

}
