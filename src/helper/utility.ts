import moment, { isMoment, Moment } from 'moment';

export const memoize = (fn = (...args: Array<any>) => null) => {
  let lastArgs: Array<any> = [];
  let lastResult: any = null;
  let called = false;

  function memoized(...args: Array<any>) {
    const newArgs = [];

    for (let _i = 0; _i < args.length; _i++) {
      newArgs[_i] = args[_i];
    }

    if (called && newArgs == lastArgs) {
      return lastResult;
    }

    lastResult = fn.apply(window, newArgs);
    called = true;
    lastArgs = newArgs;
    return lastResult;
  }
  return memoized;
}

export const decodeHTMLTags = (str = "") => {
  const htmlTagRegex = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi
  const entities = {
    'amp': '&',
    'apos': '\'',
    '#x27': '\'',
    '#x2F': '/',
    '#39': '\'',
    '#47': '/',
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'quot': '"',
  }

  return str.replace(htmlTagRegex, '').replace(/&([^;]+);/gm, (match, entity: keyof typeof entities) => entities[entity] || match)
}

export const chunkArrayInGroups = (arr: Array<any>, size: number) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

// export const getFormattedTime = (time: Date | Moment) => {

//   if (moment(time).isBefore(moment().subtract(7, "days"))) {
//     return moment(time).format("DD-MMM-YYYY")
//   }

//   return moment(time).locale('en', {
//     relativeTime : {
//       s  : 'few seconds',
//       ss : '%ds',
//       m:  "a minute",
//       mm: "%dm",
//       h:  "an hour",
//       hh: "%dh",
//       d:  "a day",
//       dd: "%dd",
//       w:  "a week",
//       ww: "%dw",
//       M:  "a month",
//       MM: "%d months",
//       y:  "an year",
//       yy: "%dy",
//   },
//   }).fromNow(true)
// }

export const cleanObject = (obj: any = {}) => {
  if (!obj) { return {} }
  for (let key in obj) {
    if (!obj[key]) {
      delete obj[key];
    }
  }
  return obj;
}

export const mergeArrayByKey = (des: Array<any> = [], src: Array<any> = [], key: string = "id") => {

  let merged: Array<any> = Object.assign([], des)

  src.forEach(value => {
    const existingItem = merged.findIndex(e => e[key] == value[key]);
    if (existingItem != -1) {
      merged[existingItem] = Object.assign({}, {
        ...merged[existingItem],
        ...value,
      })
    } else {
      merged.push(value);
    }
  })
  return merged;
}

export const getCalendarDate = (date: Date | Moment) => {
  return moment(date).calendar({
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD MMM',
})
};

export const groupBy = (xs: Array<any>, key: string) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const unmarshalFormData = function (formData: FormData) {
	const obj: any = {};
	for (let key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};