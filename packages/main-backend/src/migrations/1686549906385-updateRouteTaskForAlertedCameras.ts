import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteTaskForAlertedCameras1686549906385 implements MigrationInterface {
  name = "UpdateRouteTaskForAlertedCameras1686549906385";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" ADD \"alertedCameraIds\" json DEFAULT '{}'");
    await queryRunner.query("UPDATE \"route_task\" SET \"alertedCameraIds\" = '{}'");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_task\" DROP COLUMN \"alertedCameraIds\"");
  }

}
