import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateNameLength1683781547675 implements MigrationInterface {
  name = "UpdateNameLength1683781547675";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera\" RENAME COLUMN \"tag\" TO \"tags\"");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"site\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"nxWitnessId\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"setting\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"tag\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"sop\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"route_task\" ALTER COLUMN \"name\" TYPE character varying(100)");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"sop\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"tag\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"setting\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"nxWitnessId\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"site\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"camera\" RENAME COLUMN \"tags\" TO \"tag\"");
  }

}
