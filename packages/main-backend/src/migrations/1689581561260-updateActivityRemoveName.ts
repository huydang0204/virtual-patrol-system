import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateActivityRemoveName1689581561260 implements MigrationInterface {
  name = "UpdateActivityRemoveName1689581561260";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"activity\" DROP COLUMN \"name\"");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"activity\" ADD \"name\" character varying(100) NOT NULL");
  }

}
