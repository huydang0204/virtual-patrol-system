import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteAddAllowStartTime1686650202463 implements MigrationInterface {
  name = "UpdateRouteAddAllowStartTime1686650202463";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" ADD \"allowStartTime\" int NOT NULL DEFAULT 0");
    await queryRunner.query("UPDATE \"route\" SET \"allowStartTime\" = 0");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"allowStartTime\"");
  }

}
