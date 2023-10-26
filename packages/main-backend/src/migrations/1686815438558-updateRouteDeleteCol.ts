import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteDeleteCol1686815438558 implements MigrationInterface {
  name = "UpdateRouteDeleteCol1686815438558";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"deletedAt\"");
    await queryRunner.query("ALTER TABLE \"route\" ADD \"deleted\" boolean NOT NULL DEFAULT false");
    await queryRunner.query("UPDATE \"route\" SET \"deleted\"=false");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"deleted\"");
    await queryRunner.query("ALTER TABLE \"route\" ADD \"deletedAt\" TIMESTAMP WITH TIME ZONE");
  }

}
