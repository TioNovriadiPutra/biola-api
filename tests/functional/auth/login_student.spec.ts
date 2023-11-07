import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories/UserFactory";

test.group("Auth login students", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should respond with status code 400 when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/auth/login/students");

    response.assertStatus(400);
  });

  test("should respond with error message when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/auth/login/students");

    response.assertBody({ message: "Email and Password must be filled!" });
  });

  test("should response with status code 403 when email or password incorrect", async ({
    client,
  }) => {
    await UserFactory.create();

    const loginInput: LoginInput = {
      email: "test@gmail.com",
      password: "secretpassword",
    };

    const response = await client.post("/auth/login/students").form(loginInput);

    response.assertStatus(401);
  });

  test("should response with message email or password incorrect", async ({
    client,
  }) => {
    await UserFactory.create();

    const loginInput: LoginInput = {
      email: "test@gmail.com",
      password: "secretpassword",
    };

    const response = await client.post("/auth/login/students").form(loginInput);

    response.assertBody({ message: "Email or Password incorrect!" });
  });

  test("should response with status code 200 with login success", async ({
    client,
  }) => {
    const userData = await UserFactory.apply("loginAdmin").create();

    const loginInput: LoginInput = {
      email: userData.email,
      password: "secretpassword",
    };

    const response = await client.post("/auth/login/students").form(loginInput);

    response.assertStatus(200);
  });

  test("should response with message login success", async ({
    client,
    assert,
  }) => {
    const userData = await UserFactory.apply("loginAdmin").create();

    const loginInput: LoginInput = {
      email: userData.email,
      password: "secretpassword",
    };

    const response = await client.post("/auth/login/students").form(loginInput);

    assert.exists(response.body().token);
    response.assertBodyContains({ message: "Login success!" });
  });
});
