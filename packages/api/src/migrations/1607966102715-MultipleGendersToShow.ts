import { MigrationInterface, QueryRunner } from "typeorm";

export class MultipleGendersToShow1607966102715 implements MigrationInterface {
  name = "MultipleGendersToShow1607966102715";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "gendersToShow" text array NOT NULL DEFAULT array['male', 'female', 'non-binary']`
    );
    await queryRunner.query(
      `update "user"
       set "gendersToShow" = array['male']
       where "genderToShow" = 'male'
      `
    );
    await queryRunner.query(
      `update "user"
       set "gendersToShow" = array['female']
       where "genderToShow" = 'female'
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gendersToShow"`);
  }
}
