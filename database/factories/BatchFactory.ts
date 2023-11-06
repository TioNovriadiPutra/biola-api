import Batch from "App/Models/Batch";
import Factory from "@ioc:Adonis/Lucid/Factory";

export const BatchFactory = Factory.define(Batch, ({ faker }) => {
  return {
    batchNumber: faker.number.int({ min: 1000, max: 9999 }).toString(),
  };
}).build();
