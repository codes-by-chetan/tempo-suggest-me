import api from "./api.service";
import { getAccessToken } from "./notification.service";

// Common response interface
export interface response {
  data: { [key: string]: any } | null;
  success: boolean;
  message: string;
  statusCode: number;
  redirect?: string;
}

// Interface for content response data
export interface ContentResponse {
  id: string;
  contentId: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator: string;
  description?: string;
  status: string;
  addedAt: string;
  suggestionId: string | null;
}

interface GetUserContentParams {
  page?: number;
  limit?: number;
  type?: string;
}

// Interface for add content request
interface AddContentParams {
  content: { id: string; type: string };
  status?: string;
  suggestionId?: string;
  [key: string]: any;
}

// Interface for update content status request
interface UpdateContentStatusParams {
  status: string;
  [key: string]: any;
}


// Interface for check content request
interface CheckContentParams {
  contentId?: string;
  suggestionId?: string;
}

export const addContent = async (data: AddContentParams) => {
  return api
    .post("user/content", data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};

export const updateContentStatus = async (contentId: string, data: UpdateContentStatusParams) => {
  return api
    .patch(`user/content/${contentId}/status`, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};

export const getUserContent = async (params: GetUserContentParams = {}) => {
  const { page = 1, limit = 12, type } = params;
    return api.get<Response>("user/content", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      params: {
        page,
        limit,
        ...(type && { type }), // Only include type if provided
      },
    }).then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};
export const getContentById = async (contentId: string) => {
  return api
    .get(`user/content/${contentId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};

export const deleteContent = async (contentId: string) => {
  return api
    .delete(`user/content/${contentId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};

export const checkContent = async (params: CheckContentParams) => {
  if (!params.contentId && !params.suggestionId) {
    throw new Error("Bhai, contentId ya suggestionId, kuch toh daal!");
  }
  return api
    .get(`user/content/check`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      params,
    })
    .then((response: any) => {
      return response.data as response;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data as response;
    });
};