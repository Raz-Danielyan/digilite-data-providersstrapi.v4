import MainClient from "./main-client.js";
import normalize from "./normilize.js";

export const APIProvider = ({
  APIRoot,
  headers = {},
  accessToken,
  statusHandler,
}) => {
  const client = MainClient({ APIRoot, headers, accessToken, statusHandler });

  const getChangedParams = (params = {}) => {
    const defaultParmasValues = {
      sort: [],
      populate: "*",
      fields: [],
      publicationState: "",
      locale: "",
      pageSize: "",
      page: "",
      start: "",
      limit: "",
      _q: null,
      withCount: true,
    };
    const {
      sort,
      populate,
      fields,
      publicationState,
      locale,
      pageSize,
      page,
      start,
      limit,
      withCount,
      _q,
      ...filters
    } = { ...defaultParmasValues, ...params };

    return {
      ...(Object.keys(sort).length !== 0 ? { sort: { ...sort } } : {}),
      populate: typeof populate === "string" ? populate : { ...populate },
      ...(Object.keys(fields).length !== 0 ? { fields: { ...fields } } : {}),
      ...(publicationState ? { publicationState } : {}),
      ...(locale ? { locale } : {}),
      ...(Object.keys(filters).length !== 0 ? { filters: { ...filters } } : {}),
      pagination: {
        ...(pageSize ? { pageSize } : {}),
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        ...(typeof start === "number" ? { start } : {}),
        _q,
        withCount,
      },
    };
  };

  const customApi = (url, customParams) => ({
    get: ({ headers, ...params } = {}) =>
      client.get(url, {
        params: customParams ? getChangedParams(params) : params,
        headers,
      }),
    getOne: ({ id, headers, ...params } = {}) =>
      client.get(`${url}/${id}`, {
        params: customParams ? getChangedParams(params) : params,
        headers,
      }),
    count: ({ headers, ...params } = {}) =>
      client.get(`${url}/count`, {
        params: customParams ? getChangedParams(params) : params,
        headers,
      }),
    update: ({ headers, ...params } = {}) =>
      client.put(`${url}/${params.id}`, params.values, headers),
    add: ({ headers, ...data }) => client.post(url, data, headers),
    delete: ({ headers, ...params } = {}) =>
      client.delete(`${url}/${params.id}`, { params, headers }),
  });

  return function (url, types, customParams = true) {
    return types?.length
      ? types.map((item) => customApi(url, customParams)?.[item])
      : Object.values(customApi(url));
  };
};

export const Normalize = normalize;
