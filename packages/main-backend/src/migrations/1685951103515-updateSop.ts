import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateSop1685951103515 implements MigrationInterface {
  name = "UpdateSop1685951103515";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"sop\" DROP COLUMN \"description\"");
    await queryRunner.query(`ALTER TABLE "sop"
        ADD "type" character varying(20) NOT NULL DEFAULT 'General'`);
    await queryRunner.query(`ALTER TABLE "sop"
        ADD "checklists" text array`);
    await queryRunner.query(`ALTER TABLE "sop"
        ADD "startDate" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "sop"
        ADD "endDate" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"sop\" DROP COLUMN \"endDate\"");
    await queryRunner.query("ALTER TABLE \"sop\" DROP COLUMN \"startDate\"");
    await queryRunner.query("ALTER TABLE \"sop\" DROP COLUMN \"checklists\"");
    await queryRunner.query("ALTER TABLE \"sop\" DROP COLUMN \"type\"");
    await queryRunner.query(`ALTER TABLE "sop"
        ADD "description" character varying(200)`);
  }

}
