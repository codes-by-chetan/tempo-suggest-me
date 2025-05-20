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

export const addContent = async (data: AddContentParams) => {
  return api
    .post("content", data, {
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
    .patch(`content/${contentId}/status`, data, {
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

export const getUserContent = async () => {
  return api
    .get(`content`, {
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

export const getContentById = async (contentId: string) => {
  return api
    .get(`content/${contentId}`, {
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
    .delete(`content/${contentId}`, {
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