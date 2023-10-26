import {
  MigrationInterface,
  QueryRunner
} from "typeorm";

export class UpdateCascadeRelation1684384759714 implements MigrationInterface {
  name = "UpdateCascadeRelation1684384759714";

  public async up(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP CONSTRAINT \"FK_ac2154d157faf3d19315cc24b70\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_998010f82ee03cde7486ebca4aa\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_b00d1a7e0ffc66a12ac4442d464\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" DROP CONSTRAINT \"FK_5a5eb41b77dcfeab9a4d4fad6a8\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP CONSTRAINT \"FK_2f627983f65d4641a90a89fdf32\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_d82bf55d13dcf041f9e7d835db0\"");
    await queryRunner.query(`ALTER TABLE "route_schedule"
        ADD CONSTRAINT "FK_ac2154d157faf3d19315cc24b70" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "route"
        ADD CONSTRAINT "FK_b00d1a7e0ffc66a12ac4442d464" FOREIGN KEY ("createdUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "route"
        ADD CONSTRAINT "FK_998010f82ee03cde7486ebca4aa" FOREIGN KEY ("siteId") REFERENCES "site" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "route_checkpoint"
        ADD CONSTRAINT "FK_5a5eb41b77dcfeab9a4d4fad6a8" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "camera"
        ADD CONSTRAINT "FK_2f627983f65d4641a90a89fdf32" FOREIGN KEY ("siteId") REFERENCES "site" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "checkpoint_camera"
        ADD CONSTRAINT "FK_29da084c7c5e5f6a5a57c46bdf2" FOREIGN KEY ("camera_id") REFERENCES "camera" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "checkpoint_report"
        ADD CONSTRAINT "FK_d82bf55d13dcf041f9e7d835db0" FOREIGN KEY ("checkpointId") REFERENCES "route_checkpoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner : QueryRunner) : Promise<void> {
    await queryRunner.query("ALTER TABLE \"checkpoint_report\" DROP CONSTRAINT \"FK_d82bf55d13dcf041f9e7d835db0\"");
    await queryRunner.query("ALTER TABLE \"checkpoint_camera\" DROP CONSTRAINT \"FK_29da084c7c5e5f6a5a57c46bdf2\"");
    await queryRunner.query("ALTER TABLE \"camera\" DROP CONSTRAINT \"FK_2f627983f65d4641a90a89fdf32\"");
    await queryRunner.query("ALTER TABLE \"route_checkpoint\" DROP CONSTRAINT \"FK_5a5eb41b77dcfeab9a4d4fad6a8\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_998010f82ee03cde7486ebca4aa\"");
    await queryRunner.query("ALTER TABLE \"route\" DROP CONSTRAINT \"FK_b00d1a7e0ffc66a12ac4442d464\"");
    await queryRunner.query("ALTER TABLE \"route_schedule\" DROP CONSTRAINT \"FK_ac2154d157faf3d19315cc24b70\"");
    await queryRunner.query(`ALTER TABLE "checkpoint_report"
        ADD CONSTRAINT "FK_d82bf55d13dcf041f9e7d835db0" FOREIGN KEY ("checkpointId") REFERENCES "route_checkpoint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "checkpoint_camera"
        ADD CONSTRAINT "FK_29da084c7c5e5f6a5a57c46bdf2" FOREIGN KEY ("camera_id") REFERENCES "camera" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "camera"
        ADD CONSTRAINT "FK_2f627983f65d4641a90a89fdf32" FOREIGN KEY ("siteId") REFERENCES "site" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "route_checkpoint"
        ADD CONSTRAINT "FK_5a5eb41b77dcfeab9a4d4fad6a8" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "route"
        ADD CONSTRAINT "FK_b00d1a7e0ffc66a12ac4442d464" FOREIGN KEY ("createdUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "route"
        ADD CONSTRAINT "FK_998010f82ee03cde7486ebca4aa" FOREIGN KEY ("siteId") REFERENCES "site" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "route_schedule"
        ADD CONSTRAINT "FK_ac2154d157faf3d19315cc24b70" FOREIGN KEY ("routeId") REFERENCES "route" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
