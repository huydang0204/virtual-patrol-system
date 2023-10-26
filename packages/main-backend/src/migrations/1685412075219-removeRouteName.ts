import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class RemoveRouteName1685412075219 implements MigrationInterface {
  name = "RemoveRouteName1685412075219";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP COLUMN \"name\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" DROP COLUMN \"name\"");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`ALTER TABLE "route_checkpoint"
        ADD "name" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "route_schedule"
        ADD "name" character varying(100)`);
  }

}
