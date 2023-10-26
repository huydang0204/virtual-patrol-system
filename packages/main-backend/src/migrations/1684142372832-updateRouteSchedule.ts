import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateRouteSchedule1684142372832 implements MigrationInterface {
  name = "UpdateRouteSchedule1684142372832";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_schedule\" ALTER COLUMN \"executingDays\" DROP NOT NULL");
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP COLUMN \"executingTime\"");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ADD \"executingTime\" json");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP COLUMN \"executingTime\"");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ADD \"executingTime\" json array NOT NULL");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ALTER COLUMN \"executingDays\" SET NOT NULL");
  }

}
