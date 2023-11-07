import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories/UserFactory";

test.group("Batches get all batches", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should response with status code 401 when data fetched", async ({
    client,
  }) => {
    const response = await client.get("/batches");

    response.assertStatus(401);
  });

  test("should response with error message unauthorized access when not login first", async ({
    client,
  }) => {
    const response = await client.get("/batches");

    response.assertBody({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });

  test("should response with status code 200 when data successfully fetched", async ({
    client,
  }) => {
    const newUser = await UserFactory.create();

    const response = await client.get("/batches").loginAs(newUser);

    response.assertStatus(200);
  });

  test("should response success message and also returning all batches data", async ({
    client,
  }) => {
    const newUser = await UserFactory.create();

    const response = await client.get("/batches").loginAs(newUser);

    response.assertBodyContains({
      message: "Data fetched!",
    });

    response.assertBodyContains({
      data: Array,
    });
  });
});
