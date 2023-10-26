import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateDashboardAnalytics1688957430540 implements MigrationInterface {
  name = "UpdateDashboardAnalytics1688957430540";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"dashboard_analytics\" DROP CONSTRAINT \"PK_a826f8262ecb756e41d9ddc60af\"");
    await queryRunner.query(`ALTER TABLE "dashboard_analytics"
        ADD CONSTRAINT "PK_ccd9d26a93362cc7cc4db0e5631" PRIMARY KEY ("id", "siteId")`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"dashboard_analytics\" DROP CONSTRAINT \"PK_ccd9d26a93362cc7cc4db0e5631\"");
    await queryRunner.query(`ALTER TABLE "dashboard_analytics"
        ADD CONSTRAINT "PK_a826f8262ecb756e41d9ddc60af" PRIMARY KEY ("id")`);
  }

}
