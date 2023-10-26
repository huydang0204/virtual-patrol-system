import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateCamera1685502587788 implements MigrationInterface {
  name = "UpdateCamera1685502587788";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`ALTER TABLE "camera"
        ADD "sops" text array`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"sops\"");
  }

}
