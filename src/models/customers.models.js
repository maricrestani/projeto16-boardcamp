import joi from "joi";

export const newCustomerSchema = joi.object({
  name: joi.string().min(3).required(),
  phone: joi.string().alphanum().min(10).max(11).required(),
  cpf: joi.string().alphanum().min(11).max(11).required(),
  birthday: joi.date().required(),
});
