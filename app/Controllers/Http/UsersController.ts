import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Role } from "App/Enums/Role";
import User from "App/Models/User";

export default class UsersController {
  public async getAllStudents({ response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with("UserPolicy").denies("before"))
        throw "Account don't have access!";

      const allStudents = await User.query()
        .preload("profile", (tmp) => {
          tmp.preload("batch");
        })
        .where("role_id", Role.USER);

      return response.ok({
        message: "Data fetched!",
        data: allStudents,
      });
    } catch (error) {
      return response.forbidden({ message: error });
    }
  }
}
