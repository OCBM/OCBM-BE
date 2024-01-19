# OCBM-BE

OMNEX Conditional Based Management Backend

## Run the project

1. un-install the existing `dist` & `node_modules`
2. Install the dependencies by running `npm install`
3. save the `.env` file
4. Build the Docker images by running `docker-compose -f docker-compose.dev.yml build`
5. Start the services by running `docker-compose -f docker-compose.dev.yml up`
6. Go to Docker desktop
7. Go to `ocbm_be_server`
8. Click on `Exec`
9. Then inside the `Exec` run `npm run prisma:migrate`
10. In OCBM-FE replace the new URL `VITE_APP_API_BASE_URL=http://localhost:9160`
