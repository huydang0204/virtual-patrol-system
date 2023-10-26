import {
  MigrationInterface,
  QueryRunner 
} from "typeorm";

export class UpdateCameraCheckpoint1683781979485 implements MigrationInterface {
  name = "UpdateCameraCheckpoint1683781979485";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE \"checkpoint_camera\" (\"id\" SERIAL NOT NULL, \"camera_id\" uuid, \"route_checkpoint_id\" uuid, CONSTRAINT \"PK_a6799545d14c2ce6f46e05003bd\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE TABLE \"route_checkpoint_cameras_camera\" (\"routeCheckpointId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_0a3ae2493a1df166f4a1045c8e7\" PRIMARY KEY (\"routeCheckpointId\", \"cameraId\"))");
    await queryRunner.query("CREATE INDEX \"IDX_e523c1cd32eeac427d5f7a2b7e\" ON \"route_checkpoint_cameras_camera\" (\"routeCheckpointId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_864a0585eb4e5a7671dc7d8cc6\" ON \"route_checkpoint_cameras_camera\" (\"cameraId\") ");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" ADD CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\" FOREIGN KEY (\"camera_id\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" ADD CONSTRAINT \"FK_2ec203d030e1dba2c10ccfeb6f3\" FOREIGN KEY (\"route_checkpoint_id\") REFERENCES \"route_checkpoint\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" ADD CONSTRAINT \"FK_e523c1cd32eeac427d5f7a2b7e5\" FOREIGN KEY (\"routeCheckpointId\") REFERENCES \"route_checkpoint\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" ADD CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");

    // remove old join table
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" DROP CONSTRAINT \"FK_c218badb1651d0e7a2cbd63bd3b\"");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" DROP CONSTRAINT \"FK_ad84c60b00de8c548249bbd2119\"");
    await queryRunner.query("DROP TABLE \"camera_checkpoint\"");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" DROP CONSTRAINT \"FK_864a0585eb4e5a7671dc7d8cc61\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint_cameras_camera\" DROP CONSTRAINT \"FK_e523c1cd32eeac427d5f7a2b7e5\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_2ec203d030e1dba2c10ccfeb6f3\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_864a0585eb4e5a7671dc7d8cc6\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_e523c1cd32eeac427d5f7a2b7e\"");
    await queryRunner.query("DROP TABLE \"route_checkpoint_cameras_camera\"");
    await queryRunner.query("DROP TABLE \"checkpoint_camera\"");
    await queryRunner.query("CREATE TABLE \"camera_checkpoint\" (\"routeCheckpointId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_1816a0d07a6c15af58709500090\" PRIMARY KEY (\"routeCheckpointId\", \"cameraId\"))");
    await queryRunner.query("CREATE INDEX \"IDX_ad84c60b00de8c548249bbd211\" ON \"camera_checkpoint\" (\"routeCheckpointId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_c218badb1651d0e7a2cbd63bd3\" ON \"camera_checkpoint\" (\"cameraId\") ");

    await queryRunner.query("CREATE TABLE \"camera_checkpoint\" (\"routeCheckpointId\" uuid NOT NULL, \"cameraId\" uuid NOT NULL, CONSTRAINT \"PK_1816a0d07a6c15af58709500090\" PRIMARY KEY (\"routeCheckpointId\", \"cameraId\"))");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" ADD CONSTRAINT \"FK_ad84c60b00de8c548249bbd2119\" FOREIGN KEY (\"routeCheckpointId\") REFERENCES \"route_checkpoint\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
    await queryRunner.query("ALTER TABLE \"camera_checkpoint\" ADD CONSTRAINT \"FK_c218badb1651d0e7a2cbd63bd3b\" FOREIGN KEY (\"cameraId\") REFERENCES \"camera\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");

  }

}
