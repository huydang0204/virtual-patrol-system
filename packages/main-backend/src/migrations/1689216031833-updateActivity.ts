import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateActivity1689216031833 implements MigrationInterface {
  name = "UpdateActivity1689216031833";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"activity\" DROP COLUMN \"object\"");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"activity\" ADD \"object\" character varying(200) NOT NULL");
  }

}
