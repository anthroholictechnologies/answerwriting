import { z } from "zod";

export const purchaseSchema = z.object({
  billingOptionId: z.string({ message: "billing id is required" }),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
