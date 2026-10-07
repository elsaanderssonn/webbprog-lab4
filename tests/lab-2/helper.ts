import { expect, Locator } from "playwright/test";

export async function checkCartRow(
  row: Locator,
  salad: {
    text: string;
    vegan: number;
    lactose: number;
    gluten: number;
    price: string;
  }
) {
  const cells = row.locator("td");
  await expect(cells.nth(0).getByText(salad.text)).toBeVisible();
  await expect(cells.nth(1).locator("//div/*[local-name()='svg']")).toHaveCount(
    salad.vegan
  );
  await expect(cells.nth(2).locator("//div/*[local-name()='svg']")).toHaveCount(
    salad.lactose
  );
  await expect(cells.nth(3).locator("//div/*[local-name()='svg']")).toHaveCount(
    salad.gluten
  );
  await expect(cells.nth(4).getByText(salad.price)).toBeVisible();
}
