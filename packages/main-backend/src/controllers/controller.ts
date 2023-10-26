import { Router } from "express";

class Controller {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    return this.router;
  }

}

export default Controller;
