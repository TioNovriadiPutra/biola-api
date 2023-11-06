import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";
import { Role } from "App/Enums/Role";

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: faker.number.int({ min: 1, max: 2 }),
  };
})
  .state("loginAdmin", (user) => {
    (user.email = "test@gmail.com"),
      (user.password = "secretpassword"),
      (user.roleId = Role.ADMIN);
  })
  .state("loginUser", (user) => {
    (user.email = "test@gmail.com"),
      (user.password = "secretpassword"),
      (user.roleId = Role.USER);
  })
  .build();
