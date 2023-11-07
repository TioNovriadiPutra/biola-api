import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories/UserFactory";

test.group("Batches create batch", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should response with status code 401 when admin not login first", async ({
    client,
  }) => {
    const response = await client.post("/batches");

    response.assertStatus(401);
  });

  test("should response with error message unauthorized access when admin not login", async ({
    client,
  }) => {
    const response = await client.post("/batches");

    response.assertBody({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });

  test("should response with status code 400 when admin not provided the batch number input", async ({
    client,
  }) => {
    const newUser = await UserFactory.create();

    const response = await client.post("/batches").loginAs(newUser);

    response.assertStatus(400);
  });

  test("should response with error messages when admin not provide the batch number input", async ({
    client,
  }) => {
    const newUser = await UserFactory.create();

    const response = await client.post("/batches").loginAs(newUser);

    response.assertBody([
      {
        rule: "required",
        field: "batch",
        message: "Batch must be filled!",
      },
    ]);
  });

  test("should response with status code 403 when not using admin account", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginUser").create();

    const batchInput: BatchInput = {
      batch: "2001",
    };

    const response = await client
      .post("/batches")
      .loginAs(newUser)
      .form(batchInput);

    response.assertStatus(403);
  });

  test("should response with error message saying account dont have access when not using admin account", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginUser").create();

    const batchInput: BatchInput = {
      batch: "2001",
    };

    const response = await client
      .post("/batches")
      .loginAs(newUser)
      .form(batchInput);

    response.assertBody({
      message: "Account don't have access!",
    });
  });

  test("should response with status code 201 when success adding batch", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginAdmin").create();

    const batchInput: BatchInput = {
      batch: "2001",
    };

    const response = await client
      .post("/batches")
      .loginAs(newUser)
      .form(batchInput);

    response.assertStatus(201);
  });

  test("should response with message saying create batch success", async ({
    client,
  }) => {
    const newUser = await UserFactory.apply("loginAdmin").create();

    const batchInput: BatchInput = {
      batch: "2001",
    };

    const response = await client
      .post("/batches")
      .loginAs(newUser)
      .form(batchInput);

    response.assertBody({
      message: "Batch successfully added!",
    });
  });
});
