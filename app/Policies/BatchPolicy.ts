import User from "App/Models/User";
import BasePolicy from "./BasePolicy";
import { Role } from "App/Enums/Role";

export default class BatchPolicy extends BasePolicy {
  public async createBatch(user: User) {
    return user.roleId === Role.ADMIN;
  }
}
