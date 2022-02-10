const FUNC_EXP = {
  equals: "==",
  not_equals: "!=",
  greater_than: ">",
  less_than: ">",
  greater_than_or_equal: ">=",
  less_than_or_equal: "<=",
  contains: "@=",
  starts_with: "_=",
  not_contains: "!@=",
  not_starts_with: "!_=",
};
class SieveGen {
  value: string | number;
  exp: keyof typeof FUNC_EXP = "contains";

  constructor(exp: keyof typeof FUNC_EXP, v: string | number) {
    this.setExp(exp);
    this.value = v;
  }

  setExp(exp: keyof typeof FUNC_EXP) {
    if (FUNC_EXP[exp]) {
      return this.exp = exp;
    }
    throw new Error("Invalid Sieve operation")
  }

  generate(v = this.value) {
    return `${FUNC_EXP[this.exp]}${v}`.trimEnd();
  }
}

export const Contains = (v: string | number) => new SieveGen("contains", v);
export const Equals = (v: string | number) => new SieveGen("equals", v);
export const NotEquals = (v: string | number) => new SieveGen("not_equals", v);
export const GreaterThan = (v: string | number) => new SieveGen("greater_than", v);
export const LessThan = (v: string | number) => new SieveGen("less_than", v);
export const GreaterThanOrEqual = (v: string | number) => new SieveGen("greater_than_or_equal", v);
export const LessThanOrEqual = (v: string | number) => new SieveGen("less_than_or_equal", v);
export const StartsWith = (v: string | number) => new SieveGen("starts_with", v);
export const NotContains = (v: string | number) => new SieveGen("not_contains", v);
export const NotStartsWith = (v: string | number) => new SieveGen("not_starts_with", v);

export const generateFilterQuery = (items: { [key in keyof typeof FUNC_EXP]: SieveGen }) => {
  return Object.keys(items)
    .map((k) => {
      const f = items[k as keyof typeof FUNC_EXP];
      if (f instanceof SieveGen) {
        return `${k}${f.generate()}`
      }
      return null;
    })
    .filter(v => v)
    .join(",");
};

export const generateSortQuery = (data: {[key in string]: "asc" | "desc"} = {}): string => {
  return Object.keys(data).map((key) => {
    const direction = data[key];
    switch(direction) {
      case "desc":
        return `-${key}`;
      case "asc":
      default:
        return `+${key}`
    }
  }).join(",")
}