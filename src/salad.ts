import { v4 as uuidv4 } from "uuid";
import { type IngredientInfo, type PartialInventory } from "./inventory.js";

type SaladInfo = {
  vegan: boolean;
  gluten: boolean;
  lactose: boolean;
};

class Salad {
  readonly ingredients: PartialInventory;
  readonly uuid: string;

  constructor(init?: PartialInventory, uuid?: string) {
    // ? innebär att argumentet är valfritt, värdet blir undefined om inget skickas med
    this.ingredients = init ?? {}; // använd objekt med salladens ingredienser, annars {}
    this.uuid = uuid ?? uuidv4(); // behåll samma ID, skapa unikt ID vid ny sallad
  }

  /**
   * @returns a new salad object with the ingredient @name added.
   */
  add(name: string, info: IngredientInfo): Salad {
    const newIngredients = {
      //nya ingredienslistan
      ...this.ingredients, //gamla ingredienser
      [name]: info, // den nya ingrediensen med nyckel (namn) + värde (info)
    };
    return new Salad(newIngredients, this.uuid); //skapa en ny sallad med de gamla + nytillagda ingrediensen
  }

  /**
   * @returns a new salad object with the ingredient @name removed.
   */
  remove(name: string): Salad {
    const ingredients = { ...this.ingredients };
    delete ingredients[name];
    return new Salad(ingredients, this.uuid);
  }

  /**
   * @returns the price of this salad.
   */
  price(): number {
    const ingredients = Object.values(this.ingredients);
    // lägg till ingrediens-pris till sum för varje ingrediens
    return ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0); //summerar värden i array till ett värde
  }

  /**
   * @returns the aggregated info of of all ingredients.
   * vegan is true if all ingredients are vegan.
   * lactose and gluten is true if any of the ingredients contain the allergenic
   */
  info(): SaladInfo {
    const ingredients = Object.values(this.ingredients);
    return {
      vegan: ingredients.every((ingredient) => ingredient.vegan === true),
      gluten: ingredients.some((ingredient) => ingredient.gluten === true),
      lactose: ingredients.some((ingredient) => ingredient.lactose === true),
    };
  }

  /**
   * @param json is a JSON string with an array of Salad objects
   * @returns an array of Salad objects.
   * @throws if json is not an array, or any of the objects do not
   * have the ingredients attribute
   */
  static parse(json: string): Salad[] {
    const list = JSON.parse(json); // gör om JSON-strängen till JavaScript-objekt

    if (!Array.isArray(list)) {
      throw new Error("JSON must be an array of salads"); // kolla så det är en array
    }
    //loopa igenom varje objekt i listan och omvandlar till Salad-objekt
    return list.map((salad) => {
      if (!salad.ingredients) {
        //kontrollera om objektet saknar ingredients
        throw new Error("Invalid object: missing ingredients");
      }
      return new Salad(salad.ingredients, salad.uuid);
    });
  }
}
export { Salad };
