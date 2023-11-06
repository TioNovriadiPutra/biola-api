import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories/UserFactory";

interface LoginInput {
  email?: string;
  password?: string;
}

test.group("Auth login", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should respond with status code 400 when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/auth/login");

    response.assertStatus(400);
  });

  test("should respond with error message when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/auth/login");

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

    const response = await client.post("/auth/login").form(loginInput);

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

    const response = await client.post("/auth/login").form(loginInput);

    response.assertBody({ message: "Email or Password incorrect!" });
  });

  test("should response with status code 403 when not using admin account", async ({
    client,
  }) => {
    const userData = await UserFactory.apply("loginUser").create();

    const loginInput: LoginInput = {
      email: userData.email,
      password: "secretpassword",
    };

    const response = await client.post("/auth/login").form(loginInput);

    response.assertStatus(403);
  });

  test("should response with message account not authorized when not using admin account", async ({
    client,
  }) => {
    const userData = await UserFactory.apply("loginUser").create();

    const loginInput: LoginInput = {
      email: userData.email,
      password: "secretpassword",
    };

    const response = await client.post("/auth/login").form(loginInput);

    response.assertBody({
      message: "Account not authorized!",
    });
  });

  test("should response with status code 200 with login success", async ({
    client,
  }) => {
    const userData = await UserFactory.apply("loginAdmin").create();

    const loginInput: LoginInput = {
      email: userData.email,
      password: "secretpassword",
    };

    const response = await client.post("/auth/login").form(loginInput);

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

    const response = await client.post("/auth/login").form(loginInput);

    assert.exists(response.body().token);
    response.assertBodyContains({ message: "Login success!" });
  });
});
