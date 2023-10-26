import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class AddAssignUsersToRoute1684724174055 implements MigrationInterface {
  name = "AddAssignUsersToRoute1684724174055";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query(`CREATE TABLE "route_assigned_users_user"
                             (
                                 "routeId" uuid NOT NULL,
                                 "userId"  uuid NOT NULL,
                                 CONSTRAINT "PK_95ba1b107ef28904878f60783bb" PRIMARY KEY ("routeId", "userId")
                             )`);
    await queryRunner.query("CREATE INDEX \"IDX_cd9cf4e546733ba2dbe7bf1491\" ON \"route_assigned_users_user\" (\"routeId\") ");
    await queryRunner.query("CREATE INDEX \"IDX_54ada8edd6625c46da36da2b86\" ON \"route_assigned_users_user\" (\"userId\") ");
    await queryRunner.query(`ALTER TABLE "route_assigned_users_user"
        ADD CONSTRAINT "FK_cd9cf4e546733ba2dbe7bf1491a" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "route_assigned_users_user"
        ADD CONSTRAINT "FK_54ada8edd6625c46da36da2b86c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_assigned_users_user\" DROP CONSTRAINT \"FK_54ada8edd6625c46da36da2b86c\"");
    await queryRunner.query("ALTER TABLE \"route_assigned_users_user\" DROP CONSTRAINT \"FK_cd9cf4e546733ba2dbe7bf1491a\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_54ada8edd6625c46da36da2b86\"");
    await queryRunner.query("DROP INDEX \"public\".\"IDX_cd9cf4e546733ba2dbe7bf1491\"");
    await queryRunner.query("DROP TABLE \"route_assigned_users_user\"");
  }

}
