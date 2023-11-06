import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { BatchFactory } from "Database/factories/BatchFactory";

interface UserInput {
  email?: string;
  password?: string;
  password_confirmation?: string;
  fullName?: string;
  batchId?: number;
}

test.group("Auth register", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should respond with status code 403 when user not provide data", async ({
    client,
  }) => {
    const response = await client.post("/auth/register");

    response.assertStatus(400);
  });

  test("should respond with error messages for every input error", async ({
    client,
  }) => {
    const response = await client.post("/auth/register");

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

    const response = await client.post("/auth/register").form(userInput);

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

    const response = await client.post("/auth/register").form(userInput);

    response.assertBody({ message: "Registration success!" });
  });
});
