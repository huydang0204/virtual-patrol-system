import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddAppNotification1687835556749 implements MigrationInterface {
  name = "AddAppNotification1687835556749";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`CREATE TABLE "app_notification"
                             (
                                 "id"            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
                                 "type"          character varying(30)    NOT NULL,
                                 "description"   character varying(200)   NOT NULL,
                                 "alertedUserId" uuid,
                                 "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "status"        character varying(20)    NOT NULL DEFAULT 'New',
                                 CONSTRAINT "PK_eedd392bed10015330121377b6f" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("DROP TABLE \"app_notification\"");
  }

}
