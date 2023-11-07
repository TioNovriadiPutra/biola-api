import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Batch from "App/Models/Batch";
import CreateBatchValidator from "App/Validators/CreateBatchValidator";

export default class BatchesController {
  public async createBatch({
    request,
    response,
    bouncer,
  }: HttpContextContract) {
    try {
      const data = await request.validate(CreateBatchValidator);

      if (await bouncer.with("BatchPolicy").denies("before"))
        throw "Account don't have access!";

      const newBatch = new Batch();
      newBatch.batchNumber = data.batch;

      await newBatch.save();

      return response.created({ message: "Batch successfully added!" });
    } catch (error) {
      if (error.messages) {
        return response.badRequest(error.messages.errors);
      } else {
        return response.forbidden({ message: error });
      }
    }
  }

  public async getAllBatches({ response }: HttpContextContract) {
    const allBatches = await Batch.query().preload("profiles", (tmp) => {
      tmp.preload("user");
    });

    return response.ok({ message: "Data fetched!", data: allBatches });
  }
}
