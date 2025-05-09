import api from "./api.service";
import { getAccessToken } from "./notification.service";

interface SuggestContentParams {
  content: { [key: string]: any };
  note: string;
  recepients: { [key: string]: any }[];
  [key: string]: any;
}

export const suggestContent = async (data: SuggestContentParams) => {
  return api
    .post("suggestions/suggest", data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};
export const getSuggestionDetails = async (id: string) => {
  return api
    .get(`suggestions/suggestion/details/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const getSuggestedByYou = async () => {
  return api
    .get(`suggestions/suggested/by/you`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const getSuggestedToYou = async () => {
  return api
    .get(`suggestions/suggested/to/you`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};
