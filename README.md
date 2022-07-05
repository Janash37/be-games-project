# Jan's first API

IMPORTANT NOTE:

Any user cloning this repo will not have access to the necessary environment variables (required to run
the files) unless that user creates new environment files themselves. To do so, you will need to create
two new files at the root level:

1. .env.test
2. .env.development

Into each file, add PGDATABASE=<database_name_here>, with the correct database name for that environment
(see /db/setup.sql for the correct database names). If working on a Mac, this should be all that you need
to add to the file. If working on Linux or WSL, you will likely also need to add your PGUSER and PGPASSWORD
data.

Make sure that these .env files are .gitignored so that other uses cloning your own version of this repo (if
it's public), won't have access to your own PG data.
