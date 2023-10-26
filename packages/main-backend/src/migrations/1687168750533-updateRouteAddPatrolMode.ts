import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteAddPatrolMode1687168750533 implements MigrationInterface {
  name = "UpdateRouteAddPatrolMode1687168750533";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" ADD \"patrolMode\" character varying(20) NOT NULL DEFAULT 'LiveImage'");
    await queryRunner.query("UPDATE \"route\" SET \"patrolMode\"='LiveImage'");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"patrolMode\"");
  }

}
