import { z } from "zod";

export const purchaseSchema = z.object({
  productId: z.string({ message: "product id is required for purchase" }),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
