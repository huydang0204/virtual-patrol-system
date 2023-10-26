import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateCameraAndRoute1683856881638 implements MigrationInterface {
  name = "UpdateCameraAndRoute1683856881638";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"isActive\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"latestSyncAt\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"long\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP CONSTRAINT \"UQ_6f28067035cfc00d528634eb5b6\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"cameraId\"");
    await queryRunner.query("ALTER TABLE \"route\" ADD \"createdUserId\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"lng\" character varying(100)");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"status\" character varying(20) NOT NULL DEFAULT 'offline'");
    await queryRunner.query("ALTER TABLE \"route\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" DROP CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_539de0570f448d81d67917f042e\"");
    await queryRunner.query("ALTER TABLE \"camera_group\" DROP CONSTRAINT \"FK_264fb2cd43c062c543152023b67\"");
    await queryRunner.query("ALTER TABLE \"camera\" ALTER COLUMN \"id\" DROP DEFAULT");
    await queryRunner.query("ALTER TABLE \"camera\" ALTER COLUMN \"name\" TYPE character varying(100)");
    await queryRunner.query("ALTER TABLE \"route\" ADD CONSTRAINT \"FK_b00d1a7e0ffc66a12ac4442d464\" FOREIGN KEY (\"createdUserId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" ADD CONSTRAINT \"FK_539de0570f448d81d67917f042e\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" ADD CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\" FOREIGN KEY (\"camera_id\") REFERENCES \"camera\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"camera_group\" ADD CONSTRAINT \"FK_264fb2cd43c062c543152023b67\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" ADD CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" DROP CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\"");
    await queryRunner.query("ALTER TABLE \"camera_group\" DROP CONSTRAINT \"FK_264fb2cd43c062c543152023b67\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_539de0570f448d81d67917f042e\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_b00d1a7e0ffc66a12ac4442d464\"");
    await queryRunner.query("ALTER TABLE \"route\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"camera\" ALTER COLUMN \"name\" TYPE character varying(128)");
    await queryRunner.query("ALTER TABLE \"camera\" ALTER COLUMN \"id\" SET DEFAULT uuid_generate_v4()");
    await queryRunner.query("ALTER TABLE \"camera_group\" ADD CONSTRAINT \"FK_264fb2cd43c062c543152023b67\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" ADD CONSTRAINT \"FK_539de0570f448d81d67917f042e\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" ADD CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" ADD CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\" FOREIGN KEY (\"camera_id\") REFERENCES \"camera\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"status\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP COLUMN \"lng\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP COLUMN \"createdUserId\"");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"cameraId\" character varying(128) NOT NULL");
    await queryRunner.query("ALTER TABLE \"camera\" ADD CONSTRAINT \"UQ_6f28067035cfc00d528634eb5b6\" UNIQUE (\"cameraId\")");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"long\" character varying(100)");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"latestSyncAt\" TIMESTAMP WITH TIME ZONE");
    await queryRunner.query("ALTER TABLE \"camera\" ADD \"isActive\" boolean NOT NULL DEFAULT false");
  }

}
