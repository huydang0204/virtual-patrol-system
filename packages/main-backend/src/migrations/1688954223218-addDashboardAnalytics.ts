import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddDashboardAnalytics1688954223218 implements MigrationInterface {
  name = "AddDashboardAnalytics1688954223218";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`CREATE TABLE "dashboard_analytics"
                             (
                                 "id"                        character varying(50) NOT NULL,
                                 "siteId"                    bigint                NOT NULL DEFAULT '0',
                                 "taskCountAnalytics"        json                           DEFAULT '{}',
                                 "alertCountAnalytics"       json                           DEFAULT '{}',
                                 "weeklyAlertCountAnalytics" json                           DEFAULT '[]',
                                 CONSTRAINT "PK_a826f8262ecb756e41d9ddc60af" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "dashboard_analytics"
        ADD CONSTRAINT "FK_c88f109404ac61de1de91875192" FOREIGN KEY ("siteId") REFERENCES "site" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"dashboard_analytics\" DROP CONSTRAINT \"FK_c88f109404ac61de1de91875192\"");
    await queryRunner.query("DROP TABLE \"dashboard_analytics\"");
  }

}
