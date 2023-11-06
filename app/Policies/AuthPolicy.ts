import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import { Role } from "App/Enums/Role";
import User from "App/Models/User";

export default class AuthPolicy extends BasePolicy {
  public async login(user: User) {
    return user.roleId === Role.ADMIN;
  }
}
