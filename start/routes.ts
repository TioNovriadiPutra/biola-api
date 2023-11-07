/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  Route.post("/register", "AuthController.register").as("auth.register");
  Route.post("/login", "AuthController.login").as("auth.login");
  Route.post("/register/students", "AuthController.registerStudent").as(
    "auth.register.students"
  );
  Route.post("/login/students", "AuthController.loginStudent").as(
    "auth.login.students"
  );
}).prefix("auth");

Route.group(() => {
  Route.get("/", "BatchesController.getAllBatches").as("batches.all");
  Route.post("/", "BatchesController.createBatch")
    .middleware(["auth"])
    .as("batches.create");
}).prefix("batches");

Route.group(() => {
  Route.get("/students", "UsersController.getAllStudents").as(
    "users.all.students"
  );
})
  .prefix("users")
  .middleware("auth");
