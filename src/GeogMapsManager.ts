export default class GeogMapsManager {
  private static _instance: GeogMapsManager;
  private constructor() {}
  static get instance(): GeogMapsManager {
    if (!this._instance)
      this._instance = new GeogMapsManager();
    return this._instance;
  }
  


}