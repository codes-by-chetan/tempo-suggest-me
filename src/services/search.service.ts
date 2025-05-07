import { response } from "@/interfaces/auth.interfaces";
import api from "./api.service";
import { GlobalSearchResponse, PeopleSearchResponse } from "@/interfaces/search.interface";

interface SearchParams {
  searchType?: string;
  searchTerm: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  contentTypes?: string[];
}

interface PeopleSearchParams {
  searchTerm: string;
  page?: number;
  limit?: number;
}

// Global search across all models (movies, series, books, videos, people, etc.)
export const globalSearch = async ({
  searchType = "all",
  searchTerm,
  page = 1,
  limit = 10,
  sortBy = "relevance",
  contentTypes = [],
}: SearchParams): Promise<GlobalSearchResponse> => {
    console.log(searchTerm)
  return api
    .get(`/search/global/${searchType}`, {
      params: {
        search: searchTerm,
        page,
        limit,
        sortBy,
        contentTypes: contentTypes.length ? contentTypes.join(",") : undefined,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

// Search for people (users or Person model entities)
export const searchPeople = async ({
  searchTerm,
  page = 1,
  limit = 10,
}: PeopleSearchParams): Promise<PeopleSearchResponse> => {
  return api
    .get("/search/users", {
      params: {
        search: searchTerm,
        page,
        limit,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};
