// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Create Server POST /v1/admin/server/create */
export async function createServer(
  body: API.CreateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Delete Server POST /v1/admin/server/delete */
export async function deleteServer(
  body: API.DeleteServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Filter Server List GET /v1/admin/server/list */
export async function filterServerList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.FilterServerListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.FilterServerListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create Node POST /v1/admin/server/node/create */
export async function createNode(
  body: API.CreateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Delete Node POST /v1/admin/server/node/delete */
export async function deleteNode(
  body: API.DeleteNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Filter Node List GET /v1/admin/server/node/list */
export async function filterNodeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.FilterNodeListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.FilterNodeListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Reset node sort POST /v1/admin/server/node/sort */
export async function resetSortWithNode(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Toggle Node Status POST /v1/admin/server/node/status/toggle */
export async function toggleNodeStatus(
  body: API.ToggleNodeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/server/node/status/toggle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Query all node tags GET /v1/admin/server/node/tags */
export async function queryNodeTag(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryNodeTagResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/tags`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Node POST /v1/admin/server/node/update */
export async function updateNode(
  body: API.UpdateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get Server Protocols GET /v1/admin/server/protocols */
export async function getServerProtocols(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetServerProtocolsParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetServerProtocolsResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/protocols`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Reset server sort POST /v1/admin/server/server/sort */
export async function resetSortWithServer(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/server/sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Update Server POST /v1/admin/server/update */
export async function updateServer(
  body: API.UpdateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get Server Direct List GET /v1/admin/server/:id/direct_list */
export async function getServerDirectList(
  serverId: number,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: { server_id: number; direct_list: string[] } }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/server/${serverId}/direct_list`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Server Direct List PUT /v1/admin/server/:id/direct_list */
export async function updateServerDirectList(
  serverId: number,
  body: { direct_list: string[] },
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: { server_id: number } }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/server/${serverId}/direct_list`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
