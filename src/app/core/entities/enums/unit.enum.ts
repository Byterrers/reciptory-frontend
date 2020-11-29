export class Unit {
  private static readonly U = new Unit('u', 'unity', null);
  private static readonly KG = new Unit('kg', 'mass', 0.001);
  private static readonly G = new Unit('g', 'mass', 1);
  private static readonly L = new Unit('l', 'volume', 0.001);
  private static readonly ML = new Unit('ml', 'volume', 1);
  private static readonly TBSP = new Unit('tbsp', 'mass/volume', 12);
  private static readonly TSP = new Unit('tsp', 'mass/volume', 6);

  private constructor(
    private value: string,
    private meassurement: string,
    private conversionRatio: number
  ) {}

  public static getInventoryUnits() {
    return [
      Unit.U.getValue(),
      Unit.KG.getValue(),
      Unit.G.getValue(),
      Unit.L.getValue(),
      Unit.ML.getValue()
    ];
  }

  public static getRecipeUnits() {
    return [
      Unit.U.getValue(),
      Unit.KG.getValue(),
      Unit.G.getValue(),
      Unit.L.getValue(),
      Unit.ML.getValue(),
      Unit.TBSP.getValue(),
      Unit.TSP.getValue()
    ];
  }

  public static getUnit(unit: string) {
    switch (unit) {
      case 'u':
        return Unit.U;
      case 'kg':
        return Unit.KG;
      case 'g':
        return Unit.G;
      case 'l':
        return Unit.L;
      case 'ml':
        return Unit.ML;
      case 'tbsp':
        return Unit.TBSP;
      case 'tsp':
        return Unit.TSP;
      default:
        break;
    }
  }

  getValue() {
    return this.value;
  }

  getMeassurement() {
    return this.meassurement;
  }

  getConversionRatio() {
    return this.conversionRatio;
  }

  toString() {
    return this.value;
  }
}
