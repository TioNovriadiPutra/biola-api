import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterStudentValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string([
      rules.email({
        ignoreMaxLength: true,
      }),
      rules.unique({
        table: "users",
        column: "email",
      }),
    ]),
    password: schema.string([rules.minLength(8), rules.confirmed()]),
    fullName: schema.string([
      rules.alpha({
        allow: ["space"],
      }),
    ]),
    batchId: schema.number(),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "email.required": "Email must be filled!",
    "email.email": "Email format incorrect!",
    "email.unique": "Email already registered!",
    "password.required": "Password must be filled!",
    "password.minLength": "Password must at least 8 characters!",
    "password_confirmation.confirmed": "Password confirmation failed!",
    "fullName.required": "Full name must be filled!",
    "fullName.alpha": "Full name must contain alphabets only!",
    "batchId.required": "Batch must be choosen!",
  };
}
