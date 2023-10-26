# VPS Scheduler

The package named scheduler works along with the main backend running compute-intensive chron jobs in the background. The main difference is that the scheduler does not service any RESTful APIs.

### How to run

Before you start this scheduler, you should start `main-backend` package first as the instructions from it's `README.md`. Then, you can come to this package and run the following command.

At `scheduler` package:

1. Run `npm install` to install required dependencies.
2. For development environment, run `npm run dev` to start the API server. But for production environment, run `npm run build` first and then `npm run start`.
3. Check `package.json` for further executable utility scripts (Optional).
4. You can also check environment variables including database and redis configurations in `.env`.

### Continuous Docker Build

main-backend uses github action for continuous docker build i.e. every time you push to `main` branch, the docker image will be updated. For further information, check the workflow named `publish-scheduler.yml` in the `.github` folder.

