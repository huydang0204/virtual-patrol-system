import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateSiteDeletedCol1687275284848 implements MigrationInterface {
  name = "UpdateSiteDeletedCol1687275284848";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"site\" ADD \"deleted\" boolean NOT NULL DEFAULT false");
    await queryRunner.query("UPDATE \"site\" SET \"deleted\" = true");
    await queryRunner.query("UPDATE \"site\" SET \"deleted\" = false where \"deletedAt\" IS NULL");
    await queryRunner.query("ALTER TABLE \"site\" DROP COLUMN \"deletedAt\"");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"site\" DROP COLUMN \"deletedAt\"");
    await queryRunner.query("ALTER TABLE \"site\" ADD \"deleted\" TIMESTAMP WITH TIME ZONE");
  }

}
