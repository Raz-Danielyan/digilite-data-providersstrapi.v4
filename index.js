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
        withCount,
      },
    };
  };

  const customApi = (url) => ({
    getMany: (params) => client.get(url, { params: getChangedParams(params) }),
    getOne: ({ id, ...params }) =>
      client.get(`${url}/${id}`, { params: getChangedParams(params) }),
    update: (params) => client.put(`${url}/${params.id}`, params.values),
    add: (data) => client.post(url, data),
    delete: (params) => client.delete(`${url}/${params.id}`, { params }),
  });

  return function (url, types) {
    return types?.length
      ? types.map((item) => customApi(url)?.[item])
      : Object.values(customApi(url));
  };
};

export const Normalize = normalize;
