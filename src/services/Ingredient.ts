import { Ingredient, IngredientList } from "../models/Ingredient";
import { ApiServ } from "./ApiServ";

export class IngredientService extends ApiServ<Ingredient> {
  endpoint = "ingredients";

  // Reposicion de ingredientes
  async repoIngredients(repoIngredients: IngredientList) {
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(repoIngredients),
    };
    try {
      const response = await fetch(
        `${this.apiURL}/${this.endpoint}/reponerStock`,
        requestOptions
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
