import MainClient from "./main-client.js";

const APIProvider = ({ headers = {}, accessToken, statusHandler }) => {
  const client = MainClient({ headers, accessToken, statusHandler });

  const convertToV4Params = (params={}) => {
    const defaultParmasValues= {
      populate:'*',
      fields:[],
      publicationState:'',
      locale:'',
      pageSize:'',
      page:'',
    }
    const {
      populate,
      fields,
      publicationState,
      locale,
      pageSize,
      page,
      ...filters
    } = {...defaultParmasValues,...params};

    return {
      populate:  populate,
      fields,
      publicationState,
      locale,
      filters,
      pagination: {
        pageSize,
        page,
      },
    };
  };



  const customApi = (url) => ({
    getMany: (params) =>
      client.get(url, { params: convertToV4Params(params) }),
    getOne: ({ id, ...params }) =>
      client.get(`${url}/${id}`, { params: convertToV4Params(params)}),
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

export default APIProvider;
