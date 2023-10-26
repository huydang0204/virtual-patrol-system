import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class InitDatabase1683614703366 implements MigrationInterface {
  name = "InitDatabase1683614703366";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE \"group\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"description\" character varying(128) NOT NULL, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_256aa0fda9b1de1a73ee0b7106b\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"site\" (\"id\" BIGSERIAL NOT NULL, \"name\" character varying(128), \"description\" character varying(200), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_635c0eeabda8862d5b0237b42b4\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"route_schedule\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"startOccurrenceDate\" TIMESTAMP WITH TIME ZONE NOT NULL, \"endOccurrenceDate\" TIMESTAMP WITH TIME ZONE, \"executingDays\" smallint array NOT NULL, \"executingTime\" json array NOT NULL, \"routeId\" uuid NOT NULL, CONSTRAINT \"PK_c69d77ba276b12e519715e082e2\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"route\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, \"siteId\" bigint NOT NULL DEFAULT '0', CONSTRAINT \"PK_08affcd076e46415e5821acf52d\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"route_checkpoint\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"setOrder\" integer NOT NULL, \"layoutRow\" integer NOT NULL, \"layoutCol\" integer NOT NULL, \"routeId\" uuid NOT NULL, CONSTRAINT \"PK_248b91428e865be492babb23834\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"camera\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128) NOT NULL, \"address\" character varying(300), \"lat\" character varying(100), \"long\" character varying(100), \"isActive\" boolean NOT NULL DEFAULT false, \"cameraId\" character varying(128) NOT NULL, \"region\" character varying(100), \"tag\" text array, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, \"latestSyncAt\" TIMESTAMP WITH TIME ZONE, \"bearing\" character varying(100), CONSTRAINT \"UQ_6f28067035cfc00d528634eb5b6\" UNIQUE (\"cameraId\"), CONSTRAINT \"PK_3e6992bc5e67b9f9a6f95a5fe6f\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TYPE \"public\".\"attachment_type_enum\" AS ENUM('Common')");
    await queryRunner.query("CREATE TABLE \"attachment\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"caseId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"cameraChangeRequestId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"name\" character varying(100), \"type\" \"public\".\"attachment_type_enum\" NOT NULL DEFAULT 'Common', \"mineType\" character varying(100), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_d2a80c3a8d467f08a750ac4b420\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TYPE \"public\".\"user_status_enum\" AS ENUM('active', 'inactive', 'blocked')");
    await queryRunner.query("CREATE TABLE \"user\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"nxWitnessId\" character varying(128), \"avatar\" character varying, \"name\" character varying(128) NOT NULL, \"email\" character varying(128) NOT NULL, \"callingCode\" character varying(5), \"phoneNumber\" character varying(20), \"roleId\" uuid NOT NULL DEFAULT '3579be74-c7d9-4a95-a962-2bd11f99add1', \"passwordHash\" text, \"latestLogin\" TIMESTAMP, \"latestChangePassword\" TIMESTAMP, \"status\" \"public\".\"user_status_enum\" NOT NULL DEFAULT 'active', \"isVerified\" boolean NOT NULL DEFAULT false, \"blockingReason\" text, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, \"blockedAt\" TIMESTAMP WITH TIME ZONE, \"reactivatedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"UQ_e12875dfb3b1d92d7d7c5377e22\" UNIQUE (\"email\"), CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"role\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(100) NOT NULL, \"description\" text NOT NULL, \"permissionRights\" json, CONSTRAINT \"PK_b36bcfe02fc8de3c57a8b2391c2\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TYPE \"public\".\"activity_type_enum\" AS ENUM('User')");
    await queryRunner.query("CREATE TABLE \"activity\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(100) NOT NULL, \"type\" \"public\".\"activity_type_enum\" NOT NULL, \"object\" character varying(200) NOT NULL, \"userId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"description\" character varying, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_24625a1d6b1b089c8ae206fe467\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TYPE \"public\".\"alert_type_priority_enum\" AS ENUM('Low', 'Medium', 'High')");
    await queryRunner.query("CREATE TABLE \"alert_type\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"type\" character varying(100) NOT NULL, \"priority\" \"public\".\"alert_type_priority_enum\" NOT NULL DEFAULT 'Medium', \"description\" character varying(300), \"tags\" text array, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_34f04b83e501fb1bea31e237418\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"forget_password\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"userId\" uuid NOT NULL, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_72506e37c3b5302110f6674fc28\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"setting\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"smallLogo\" character varying, \"largeLogo\" character varying, \"backgroundImage\" character varying, \"configuration\" jsonb, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_fcb21187dc6094e24a48f677bed\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"tag\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128) NOT NULL, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_8e4052373c579afc1471f526760\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"sop\" (\"id\" SERIAL NOT NULL, \"name\" character varying(128), \"description\" character varying(200), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"deletedAt\" TIMESTAMP WITH TIME ZONE, CONSTRAINT \"PK_f05ccafd8ad8c895c10d654a664\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"checkpoint_report\" (\"id\" SERIAL NOT NULL, \"comment\" character varying(100) NOT NULL, \"description\" character varying(300), \"actionTaken\" character varying(300), \"occurrenceDate\" TIMESTAMP WITH TIME ZONE NOT NULL, \"completedTime\" integer NOT NULL, \"snapshotUrl\" character varying(500), \"checkpointId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_4450d25720c89ad2c69f0897f02\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TYPE \"public\".\"route_task_status_enum\" AS ENUM('Pending', 'OnGoing', 'Completed', 'Missed')");
    await queryRunner.query("CREATE TABLE \"route_task\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying(128), \"occurrenceDate\" TIMESTAMP WITH TIME ZONE NOT NULL, \"startTime\" integer NOT NULL, \"endTime\" integer NOT NULL, \"status\" \"public\".\"route_task_status_enum\" NOT NULL DEFAULT 'Pending', \"comment\" character varying(300), \"routeId\" uuid NOT NULL, CONSTRAINT \"PK_6ddad3b90f4921853d38924b08a\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"camera_group\" (\"groupId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_eaec88771860faedff370161b60\" PRIMARY KEY (\"groupId\", \"cameraId\"))");
    await queryRunner.query("CREATE INDEX \"IDX_9791a08399e70e3471a2fc6ff2\" ON \"camera_group\" (\"groupId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_264fb2cd43c062c543152023b6\" ON \"camera_group\" (\"cameraId\") ");
    await queryRunner.query("CREATE TABLE \"camera_checkpoint\" (\"routeCheckpointId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_1816a0d07a6c15af58709500090\" PRIMARY KEY (\"routeCheckpointId\", \"cameraId\"))");
    await queryRunner.query("CREATE INDEX \"IDX_ad84c60b00de8c548249bbd211\" ON \"camera_checkpoint\" (\"routeCheckpointId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_c218badb1651d0e7a2cbd63bd3\" ON \"camera_checkpoint\" (\"cameraId\") ");
    await queryRunner.query("ALTER TABLE \"route_schedule\" ADD CONSTRAINT \"FK_ac2154d157faf3d19315cc24b70\" FOREIGN KEY (\"routeId\") REFERENCES \"route\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"route\" ADD CONSTRAINT \"FK_998010f82ee03cde7486ebca4aa\" FOREIGN KEY (\"siteId\") REFERENCES \"site\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" ADD CONSTRAINT \"FK_5a5eb41b77dcfeab9a4d4fad6a8\" FOREIGN KEY (\"routeId\") REFERENCES \"route\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"user\" ADD CONSTRAINT \"FK_c28e52f758e7bbc53828db92194\" FOREIGN KEY (\"roleId\") REFERENCES \"role\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"activity\" ADD CONSTRAINT \"FK_3571467bcbe021f66e2bdce96ea\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"forget_password\" ADD CONSTRAINT \"FK_3a624e1f40a7285b1566e35717e\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" ADD CONSTRAINT \"FK_d82bf55d13dcf041f9e7d835db0\" FOREIGN KEY (\"checkpointId\") REFERENCES \"route_checkpoint\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" ADD CONSTRAINT \"FK_539de0570f448d81d67917f042e\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"route_task\" ADD CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\" FOREIGN KEY (\"routeId\") REFERENCES \"route\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"camera_group\" ADD CONSTRAINT \"FK_9791a08399e70e3471a2fc6ff2c\" FOREIGN KEY (\"groupId\") REFERENCES \"group\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"camera_group\" ADD CONSTRAINT \"FK_264fb2cd43c062c543152023b67\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" ADD CONSTRAINT \"FK_ad84c60b00de8c548249bbd2119\" FOREIGN KEY (\"routeCheckpointId\") REFERENCES \"route_checkpoint\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" ADD CONSTRAINT \"FK_c218badb1651d0e7a2cbd63bd3b\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");

    await queryRunner.query("INSERT INTO public.role (id, name, description, \"permissionRights\") VALUES ('bd154aef-025c-4c3e-86a1-65e6ed2fdfe8', 'Admin', 'Admin', '{}')");
    await queryRunner.query("INSERT INTO public.role (id, name, description, \"permissionRights\") VALUES ('3579be74-c7d9-4a95-a962-2bd11f99add1', 'Officer', 'Officer', '{}')");
    await queryRunner.query("INSERT INTO public.role (id, name, description, \"permissionRights\") VALUES ('b5833bfd-ed88-4af7-8a85-718b5828d60a', 'Client', 'Client', '{}')");
    await queryRunner.query("INSERT INTO public.site (id, name, \"deletedAt\") VALUES ('0', 'None', current_timestamp)");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" DROP CONSTRAINT \"FK_c218badb1651d0e7a2cbd63bd3b\"");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" DROP CONSTRAINT \"FK_ad84c60b00de8c548249bbd2119\"");
    await queryRunner.query("ALTER TABLE \"camera_group\" DROP CONSTRAINT \"FK_264fb2cd43c062c543152023b67\"");
    await queryRunner.query("ALTER TABLE \"camera_group\" DROP CONSTRAINT \"FK_9791a08399e70e3471a2fc6ff2c\"");
    await queryRunner.query("ALTER TABLE \"route_task\" DROP CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_539de0570f448d81d67917f042e\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_d82bf55d13dcf041f9e7d835db0\"");
    await queryRunner.query("ALTER TABLE \"forget_password\" DROP CONSTRAINT \"FK_3a624e1f40a7285b1566e35717e\"");
    await queryRunner.query("ALTER TABLE \"activity\" DROP CONSTRAINT \"FK_3571467bcbe021f66e2bdce96ea\"");
    await queryRunner.query("ALTER TABLE \"user\" DROP CONSTRAINT \"FK_c28e52f758e7bbc53828db92194\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" DROP CONSTRAINT \"FK_5a5eb41b77dcfeab9a4d4fad6a8\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_998010f82ee03cde7486ebca4aa\"");
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP CONSTRAINT \"FK_ac2154d157faf3d19315cc24b70\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_c218badb1651d0e7a2cbd63bd3\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_ad84c60b00de8c548249bbd211\"");
    await queryRunner.query("DROP TABLE \"camera_checkpoint\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_264fb2cd43c062c543152023b6\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_9791a08399e70e3471a2fc6ff2\"");
    await queryRunner.query("DROP TABLE \"camera_group\"");
    await queryRunner.query("DROP TABLE \"route_task\"");
    await queryRunner.query("DROP TYPE \"public\".\"route_task_status_enum\"");
    await queryRunner.query("DROP TABLE \"checkpoint_report\"");
    await queryRunner.query("DROP TABLE \"sop\"");
    await queryRunner.query("DROP TABLE \"tag\"");
    await queryRunner.query("DROP TABLE \"setting\"");
    await queryRunner.query("DROP TABLE \"forget_password\"");
    await queryRunner.query("DROP TABLE \"alert_type\"");
    await queryRunner.query("DROP TYPE \"public\".\"alert_type_priority_enum\"");
    await queryRunner.query("DROP TABLE \"activity\"");
    await queryRunner.query("DROP TYPE \"public\".\"activity_type_enum\"");
    await queryRunner.query("DROP TABLE \"role\"");
    await queryRunner.query("DROP TABLE \"user\"");
    await queryRunner.query("DROP TYPE \"public\".\"user_status_enum\"");
    await queryRunner.query("DROP TABLE \"attachment\"");
    await queryRunner.query("DROP TYPE \"public\".\"attachment_type_enum\"");
    await queryRunner.query("DROP TABLE \"camera\"");
    await queryRunner.query("DROP TABLE \"route_checkpoint\"");
    await queryRunner.query("DROP TABLE \"route\"");
    await queryRunner.query("DROP TABLE \"route_schedule\"");
    await queryRunner.query("DROP TABLE \"site\"");
    await queryRunner.query("DROP TABLE \"group\"");
  }

}
