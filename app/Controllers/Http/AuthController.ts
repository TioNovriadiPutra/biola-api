import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Role } from "App/Enums/Role";
import Profile from "App/Models/Profile";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(RegisterValidator);

      const newUser = new User();
      newUser.email = data.email;
      newUser.password = data.password;
      newUser.roleId = Role.ADMIN;

      const newProfile = new Profile();
      newProfile.fullName = data.fullName;

      await newUser.related("profile").save(newProfile);

      return response.created({ message: "Registration success!" });
    } catch (error) {
      if (error.messages) {
        return response.badRequest(error.messages.errors);
      } else {
        console.log(error);
      }
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate(LoginValidator);

      const token = await auth.use("api").attempt(data.email, data.password, {
        expiresIn: "30 minute",
      });

      if (token.user.roleId !== Role.ADMIN) {
        throw "Account not authorized!";
      }

      return response.ok({
        message: "Login success!",
        token: token.token,
        userId: token.user.id,
      });
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: "Email and Password must be filled!",
        });
      } else if (error.responseText) {
        return response.unauthorized({
          message: "Email or Password incorrect!",
        });
      } else if (error === "Account not authorized!") {
        return response.forbidden({ message: error });
      }
    }
  }
}
