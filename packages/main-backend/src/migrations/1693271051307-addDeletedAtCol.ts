import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddDeletedAtCol1693271051307 implements MigrationInterface {
  name = "AddDeletedAtCol1693271051307";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`ALTER TABLE "site"
        ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`UPDATE "site"
        SET "deletedAt"= current_timestamp WHERE deleted=true`);
    await queryRunner.query(`ALTER TABLE "route"
        ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`UPDATE "route"
        SET "deletedAt"= current_timestamp WHERE deleted=true`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"deletedAt\"");
    await queryRunner.query("ALTER TABLE \"site\" DROP COLUMN \"deletedAt\"");
  }

}
