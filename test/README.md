# VPS Virtual Patrol's Test

This is the test package that uses jest to perform integration test.To run the integration test, you need to start api server first at `main-backend` package. So go to the main-backend package and read it's `README.md` and do as it's instruction. Then run `npm install` to install necessary dependencies at this test package. Then, run `npm run test` here and you will see the test result on your terminal. There are 13 main test scripts and each one of them has their own related test cases inside connecting each other.


### Test Scripts

To evolve the integration test, you can extend test scripts and concerned test cases at `test-script` directory. Currently, the project use these 12 test scripts mentioned below:

1. activity
2. alert type
3. algorithm
4. api (for pinging purpose)
5. camera
6. dashboard analytics
7. notification
8. route
9. site
10. sop
11. task
12. user

### Continuous Integetation Testing

VPS uses github action for continuous integration testing i.e. every time you push to remote, the integration test will run on github side. For further information, check the workflow named `test-main-backend.yml` in the `.github` folder.

### Use this utility query to test with camera data (Optional)

```sql

INSERT INTO public.camera  (id, name) VALUES ('bb713650-c6b3-418e-bab1-f47cb50959e2', 'cam1');
INSERT INTO public.camera  (id, name) VALUES ('5f41d45f-c06f-419f-aa53-9eb1034b03f4', 'cam2');
INSERT INTO public.camera  (id, name) VALUES ('797ddeaf-6440-4418-aaed-8487b58ca781', 'cam3');
INSERT INTO public.camera  (id, name) VALUES ('0005f2c4-73f8-4571-b4e4-57352b111058', 'cam4');

```
