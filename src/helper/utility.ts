import moment, { isMoment, Moment } from 'moment';

const appendArray = (formData: FormData, key: string, arrValue: Array<any>) => {
  arrValue.forEach((value, index) => {
    if (isMoment(value)) {
      return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${key}[${index}]`, value)
    }

    if (typeof value === typeof {} && "uri" in value) { // Handling `value instanceof File` in React Native
      return formData.append(`${key}[${index}]`, value);
    }

    if (typeof value === typeof {}) {
      return appendObject(formData, `${key}[${index}]`, value)
    }

    formData.append(`${key}[${index}]`, value);
  })
}

const appendObject = (formData: FormData, mainKey: string, data: any) => {
  Object.keys(data).forEach((key, index) => {
    const value = data[key];
    if (isMoment(value)) {
      return formData.append(`${mainKey}[${key}]`, value.format("YYYY-MM-DD"));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${mainKey}[${key}]`, value)
    }

    if (typeof value === typeof {} && "uri" in value) { // Handling `value instanceof File` in React Native
      return formData.append(`${mainKey}[${key}]`, value);
    }

    if (typeof value === typeof {}) {
      return appendObject(formData, `${mainKey}[${key}]`, value)
    }

    formData.append(`${mainKey}[${key}]`, value);
  })
}


export const getFormData = (data: any = {}) => {
  const formData = new FormData();
  for (const key in cleanObject(data)) {
    if (isMoment(data[key])) {
      formData.append(key, data[key].format("YYYY-MM-DD"));
      continue;
    }

    if (data[key] instanceof Array) {
      appendArray(formData, key, data[key])
      continue;
    }

    if (typeof data[key] === typeof {} && "uri" in data[key]) { // Handling `value instanceof File` in React Native
      formData.append(key, data[key]);
      continue;
    }

    if (typeof data[key] === typeof {}) {
      appendObject(formData, key, data[key])
      continue;
    }

    formData.append(key, data[key]);
  }
  return formData;
}

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