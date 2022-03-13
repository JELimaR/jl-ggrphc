export default class GeogEntitiesManager {
  private static _instance: GeogEntitiesManager;
  private constructor() {}
  static get instance(): GeogEntitiesManager {
    if (!this._instance)
      this._instance = new GeogEntitiesManager();
    return this._instance;
  }
  


}