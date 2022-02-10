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

export type Expression = keyof typeof FUNC_EXP 

export interface ISieveGen {
  value: string | number;
  exp: Expression;
  generate: (v: string | number) => string;
  setExp: (exp: Expression) => Expression;
}

class SieveGen implements ISieveGen {
  value: string | number;
  exp: Expression = "contains";

  constructor(exp: Expression, v: string | number) {
    this.setExp(exp);
    this.value = v;
  }

  setExp(exp: Expression) {
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

export const generateFilterQuery = (items?: { [key in Expression]: SieveGen }) => {
  if(!items) return "";
  return Object.keys(items)
    .map((k) => {
      const f = items[k as Expression];
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