class SieveGen {
    value;
    exp;
    fMap = {
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
  
    constructor(exp,v) {
      this.setExp(exp);
      this.value = v;
    }
  
    setExp(exp) {
      if(this.fMap[exp]) {
          return this.exp = exp;
      } 
      throw new Error("Invalid Sieve operation")
    }
  
    generate(v = this.value) {
      return `${this.fMap[this.exp]}${v}`.trimEnd();
    }
  }
  
  export const Contains = (v) => new SieveGen("contains", v);
  export const Equals = (v) => new SieveGen("equals", v);
  export const NotEquals = (v) => new SieveGen("not_equals", v);
  export const GreaterThan = (v) => new SieveGen("greater_than", v);
  export const LessThan = (v) => new SieveGen("less_than", v);
  export const GreaterThanOrEqual = (v) => new SieveGen("greater_than_or_equal", v);
  export const LessThanOrEqual = (v) => new SieveGen("less_than_or_equal", v);
  export const StartsWith = (v) => new SieveGen("starts_with", v);
  export const NotContains = (v) => new SieveGen("not_contains", v);
  export const NotStartsWith = (v) => new SieveGen("not_starts_with", v);
  
  export const generateFilterQuery = (items = {}) => {
    return Object.keys(items)
      .map((k) => {
          const f = items[k];
          if(f instanceof SieveGen) {
              return `${k}${f.generate()}`
          }
          return null;
      })
      .filter(v=>v)
      .join(",");
  };
  