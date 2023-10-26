
# VPS Virtual Patrol's Main Backend - BACKEND

This package services main Restful API for the VPS frontend.

### Requirements:

Please make sure you have installed the following tools:

- NodeJs 19re.x
- Postgres 15.x
- Redis 7.x

### How to run

At `main-backend` package:

1. Install all dependencies
2. Start PostgreSQL database server
3. Build an empty postgres database named `vps_dev`.
4. Start Redis server
5. Run `npm install` to install required dependencies.
6. Check environment variables including postgres database and redis configurations in `.env`.
7. Run `npm run typeorm:run` for database migration. It will create necessary tables and insert 4 initial records.
The 4 initial records are 3 roles (Admin, Officer, Client) into `public.role` and 1 site (None) into `public.site`.
8. For development environment, run `npm run dev` to start the API server. For production environment, run `npm run start`. For integration testing environment, run `ENV=test npm run dev`
9. Check `package.json` for further executable utility scripts (Optional).


### Continuous Docker Build

main-backend uses github action for continuous docker build i.e. every time you push to `main` branch, the docker image will be updated. For further information, check the workflow named `docker-publish-main-backend.yml` in the `.github` folder.

