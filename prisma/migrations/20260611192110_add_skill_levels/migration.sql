-- AlterTable: Change skills from TEXT[] to JSONB with skill name + level objects
-- Existing skills get default level "beginner"

ALTER TABLE "User" ADD COLUMN "skills_new" JSONB DEFAULT '[]'::jsonb;

UPDATE "User" SET "skills_new" = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object('name', skill, 'level', 'beginner')
    ),
    '[]'::jsonb
  )
  FROM unnest("skills") AS skill
);

ALTER TABLE "User" DROP COLUMN "skills";
ALTER TABLE "User" RENAME COLUMN "skills_new" TO "skills";
