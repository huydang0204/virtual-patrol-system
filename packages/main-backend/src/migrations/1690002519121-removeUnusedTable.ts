import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class RemoveUnusedTables1690002519121 implements MigrationInterface {
  name = "RemoveUnusedTables1690002519121";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("DROP INDEX \"public\".\"IDX_264fb2cd43c062c543152023b6\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_9791a08399e70e3471a2fc6ff2\"");
    await queryRunner.query("DROP TABLE \"camera_group\"");
    await queryRunner.query("DROP TABLE \"setting\"");
    await queryRunner.query("DROP TABLE \"attachment\"");
    await queryRunner.query("DROP TYPE \"public\".\"attachment_type_enum\"");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("CREATE TYPE \"public\".\"attachment_type_enum\" AS ENUM('Common')");
    await queryRunner.query("CREATE TABLE \"attachment\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"caseId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"cameraChangeRequestId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"name\" character varying(100), \"type\" \"public\".\"attachment_type_enum\" NOT NULL DEFAULT 'Common', \"mineType\" character varying(100), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_d2a80c3a8d467f08a750ac4b420\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"camera_group\" (\"groupId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_eaec88771860faedff370161b60\" PRIMARY KEY (\"groupId\", \"cameraId\"))");
    await queryRunner.query("CREATE INDEX \"IDX_9791a08399e70e3471a2fc6ff2\" ON \"camera_group\" (\"groupId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_264fb2cd43c062c543152023b6\" ON \"camera_group\" (\"cameraId\") ");
    await queryRunner.query("CREATE TABLE \"setting\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"smallLogo\" character varying, \"largeLogo\" character varying, \"backgroundImage\" character varying, \"configuration\" jsonb, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_fcb21187dc6094e24a48f677bed\" PRIMARY KEY (\"id\"))");

  }

}
