import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories/UserFactory";

test.group("Users get all students", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should response with status code 401 when auth token not provided", async ({
    client,
  }) => {
    const response = await client.get("/users/students");

    response.assertStatus(401);
  });

  test("should response with error message unauthorized access when auth token not provided", async ({
    client,
  }) => {
    const response = await client.get("/users/students");

    response.assertBody({
      errors: [{ message: "E_UNAUTHORIZED_ACCESS: Unauthorized access" }],
    });
  });

  test("should response with status code 403 when not using admin account", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginUser").create();

    const response = await client.get("/users/students").loginAs(newUser);

    response.assertStatus(403);
  });

  test("should response with error message when not using admin account", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginUser").create();

    const response = await client.get("/users/students").loginAs(newUser);

    response.assertBody({
      message: "Account don't have access!",
    });
  });

  test("should response with status code 200 when data fetch success", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginAdmin").create();

    const response = await client.get("/users/students").loginAs(newUser);

    response.assertStatus(200);
  });

  test("should response with success message and also return the student data", async ({
    client,
  }) => {
    const newAdmin = await UserFactory.apply("loginAdmin").create();

    const response = await client.get("/users/students").loginAs(newAdmin);

    response.assertBodyContains({
      message: "Data fetched!",
      data: Array,
    });
  });
});
