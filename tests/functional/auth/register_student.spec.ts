import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { Role } from "App/Enums/Role";
import User from "App/Models/User";
import { BatchFactory } from "Database/factories/BatchFactory";

test.group("Auth register student", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should respond with status code 403 when user not provide data", async ({
    client,
  }) => {
    const response = await client.post("/auth/register/students");

    response.assertStatus(400);
  });

  test("should respond with error messages for every input error", async ({
    client,
  }) => {
    const response = await client.post("/auth/register/students");

    response.assertBodyContains([
      {
        rule: "required",
        field: "email",
        message: "Email must be filled!",
      },
    ]);
  });

  test("should respond with status code 201 when registration is success", async ({
    client,
  }) => {
    const newBatch = await BatchFactory.create();

    const userInput: UserInput = {
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
      fullName: "Test Full Name",
      batchId: newBatch.id,
    };

    const response = await client
      .post("/auth/register/students")
      .form(userInput);

    response.assertStatus(201);
  });

  test("should respond with message registration success", async ({
    client,
  }) => {
    const newBatch = await BatchFactory.create();

    const userInput: UserInput = {
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
      fullName: "Test Full Name",
      batchId: newBatch.id,
    };

    const response = await client
      .post("/auth/register/students")
      .form(userInput);

    response.assertBody({ message: "Registration success!" });
  });

  test("should create a user account", async ({ client, assert }) => {
    const newBatch = await BatchFactory.create();

    const userInput: UserInput = {
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
      fullName: "Test Full Name",
      batchId: newBatch.id,
    };

    await client.post("/auth/register/students").form(userInput);

    const userData = await User.findByOrFail("email", userInput.email);

    assert.strictEqual(userData.roleId, Role.USER);
  });
});
