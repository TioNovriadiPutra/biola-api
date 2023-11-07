import { BasePolicy as BouncerBasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import { Role } from "App/Enums/Role";
import User from "App/Models/User";

export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User) {
    if (user.roleId === Role.ADMIN) {
      return true;
    }
  }
}
