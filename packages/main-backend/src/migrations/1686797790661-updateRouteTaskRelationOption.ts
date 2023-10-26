import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateRouteTaskRelationOption1686797790661 implements MigrationInterface {
  name = "UpdateRouteTaskRelationOption1686797790661";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query("ALTER TABLE \"task_report\" DROP COLUMN \"siteId\"");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"FK_778b171fd411864312ad1367d1b\" FOREIGN KEY (\"id\") REFERENCES \"route_task\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");

    await queryRunner.query("ALTER TABLE \"route_task\" DROP CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\"");
    await queryRunner.query("ALTER TABLE \"route_task\" ADD CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\" FOREIGN KEY (\"routeId\") REFERENCES \"route\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"task_report\" DROP CONSTRAINT \"FK_778b171fd411864312ad1367d1b\"");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD \"siteId\" bigint NOT NULL");
    await queryRunner.query("ALTER TABLE \"task_report\" ADD CONSTRAINT \"FK_778b171fd411864312ad1367d1b\" FOREIGN KEY (\"id\") REFERENCES \"route_task\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");

    await queryRunner.query("ALTER TABLE \"route_task\" DROP CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\"");
    await queryRunner.query("ALTER TABLE \"route_task\" ADD CONSTRAINT \"FK_ec1c974cb1f2310de803bda0e58\" FOREIGN KEY (\"routeId\") REFERENCES \"route\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE");
  }

}
