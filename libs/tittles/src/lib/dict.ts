export type DictKey = string | number

export type DictAny = {
  [k: DictKey]: any
}

export type DictValue<T> = {
  [k: DictKey]: T
}
export type DictArray<T> = {
  [k: DictKey]: T[]
}


export const putDictValue = <T>(
  key: DictKey,
  value: T,
  dict: DictValue<T>,
  overwrite = false
): void => {
  if (!dict[key] || overwrite) dict[key] = value
}

export const putDictArray = <T>(
  key: DictKey,
  value: T,
  dict: DictArray<T>,
  unique = false,
  compare?: (first: T, second: T) => boolean
): void => {
  let ents = dict[key]
  if (!ents) dict[key] = ents = []
  if (unique) {
    let found = false
    if (compare) {
      for (const ent of ents)
        if (compare(ent, value)) {
          found = true
          break
        }
    } else if (ents.includes(value)) found = true
    if (!found) ents.push(value)
  } else ents.push(value)
}

export const dictMerge = <T>(
  target: DictValue<T>,
  source: DictValue<T>,
  filterCb: (k: DictKey, v: T) => boolean = ((_k, v) => (v ? true : false))
): Record<string, any> => {
  for (const [k, v] of Object.entries(source))
    if (filterCb(k, v)) target[k] = v
  return target
}
