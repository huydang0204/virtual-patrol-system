import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateCameraSopRelation1685588415647 implements MigrationInterface {
  name = "UpdateCameraSopRelation1685588415647";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`CREATE TABLE "sop_cameras_camera"
                             (
                                 "sopId" integer NOT NULL,
                                 "cameraId" uuid NOT NULL,
                                 CONSTRAINT "PK_960db24e44d6b0161ff24c07e30" PRIMARY KEY ("sopId", "cameraId")
                             )`);
    await queryRunner.query("CREATE INDEX \"IDX_12bae60206122666636df989d5\" ON \"sop_cameras_camera\" (\"sopId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_9c422960ae69839c3ae7be0eea\" ON \"sop_cameras_camera\" (\"cameraId\") ");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"sops\"");
    await queryRunner.query("ALTER TABLE \"activity\" DROP COLUMN \"type\"");
    await queryRunner.query("DROP TYPE \"public\".\"activity_type_enum\"");
    await queryRunner.query(`ALTER TABLE "activity"
        ADD "type" character varying(30) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sop_cameras_camera"
        ADD CONSTRAINT "FK_12bae60206122666636df989d5e" FOREIGN KEY ("sopId") REFERENCES "sop" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "sop_cameras_camera"
        ADD CONSTRAINT "FK_9c422960ae69839c3ae7be0eeab" FOREIGN KEY ("cameraId") REFERENCES "camera" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"sop_cameras_camera\" DROP CONSTRAINT \"FK_9c422960ae69839c3ae7be0eeab\"");
    await queryRunner.query("ALTER TABLE \"sop_cameras_camera\" DROP CONSTRAINT \"FK_12bae60206122666636df989d5e\"");
    await queryRunner.query("ALTER TABLE \"activity\" DROP COLUMN \"type\"");
    await queryRunner.query("CREATE TYPE \"public\".\"activity_type_enum\" AS ENUM('User')");
    await queryRunner.query(`ALTER TABLE "activity"
        ADD "type" "public"."activity_type_enum" NOT NULL`);
    await queryRunner.query(`ALTER TABLE "camera"
        ADD "sops" text array`);
    await queryRunner.query("DROP INDEX \"public\".\"IDX_9c422960ae69839c3ae7be0eea\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_12bae60206122666636df989d5\"");
    await queryRunner.query("DROP TABLE \"sop_cameras_camera\"");
  }

}
