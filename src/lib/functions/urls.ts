export const getSearchParamsWithArray = (url: string) => {
  const params = {} as Record<string, string | string[]>

  new URL(url).searchParams.forEach((val, key) => {
    if (key in params) {
      const param = params[key]

      if (Array.isArray(param)) {
        param.push(val)
      } else {
        params[key] = [param, val]
      }
    } else {
      params[key] = val
    }
  })

  return params
}
