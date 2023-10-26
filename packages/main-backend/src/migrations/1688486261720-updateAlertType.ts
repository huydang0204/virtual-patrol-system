import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateAlertType1688486261720 implements MigrationInterface {
  name = "UpdateAlertType1688486261720";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"alert_type\" DROP COLUMN \"tags\"");
    await queryRunner.query("ALTER TABLE \"alert_type\" ADD \"actionTaken\" text array");
    await queryRunner.query("ALTER TABLE \"alert_type\" ADD \"imageUrl\" character varying");
    await queryRunner.query("ALTER TABLE \"alert_type\" DROP COLUMN \"priority\"");
    await queryRunner.query("DROP TYPE \"public\".\"alert_type_priority_enum\"");
    await queryRunner.query("ALTER TABLE \"alert_type\" ADD \"priority\" character varying(20) NOT NULL DEFAULT 'Medium'");
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"alert_type\" DROP COLUMN \"priority\"");
    await queryRunner.query("CREATE TYPE \"public\".\"alert_type_priority_enum\" AS ENUM('Low', 'Medium', 'High')");
    await queryRunner.query("ALTER TABLE \"alert_type\" ADD \"priority\" \"public\".\"alert_type_priority_enum\" NOT NULL DEFAULT 'Medium'");
    await queryRunner.query("ALTER TABLE \"alert_type\" DROP COLUMN \"imageUrl\"");
    await queryRunner.query("ALTER TABLE \"alert_type\" DROP COLUMN \"actionTaken\"");
    await queryRunner.query("ALTER TABLE \"alert_type\" ADD \"tags\" text array");
  }

}
