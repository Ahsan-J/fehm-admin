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
  exp: Expression = "equals";

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
    if(v && v != undefined) {
      return `${FUNC_EXP[this.exp]}${v}`.trimEnd();
    }
    return "";
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

export const generateFilterQuery = (items?: { [key in string]: SieveGen }): string | undefined => {
  if(!items) return undefined;
  return Object.keys(items)
    .map((k) => {
      const f = items[k];
      if (f instanceof SieveGen && f.generate()) {
        return `${k}${f.generate()}`
      }
      return null;
    })
    .filter(v => v)
    .join(",") || undefined;
};

export const generateSortQuery = (items: {[key in string]: "asc" | "desc"} = {}): string | undefined => {
  if(!items) return undefined;
  return Object.keys(items).map((key) => {
    const direction = items[key];
    switch(direction) {
      case "desc":
        return `-${key}`;
      case "asc":
      default:
        return `+${key}`
    }
  }).join(",") || undefined
}