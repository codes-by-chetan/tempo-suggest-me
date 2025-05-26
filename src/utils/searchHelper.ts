import {
  GlobalSearchResponse,
  PeopleSearchResponse,
  SearchResultsType,
} from "@/interfaces/search.interface";

export const setResults = ({
  setSearchResults,
  peopleSearchResponse,
  globalSearchResponse,
  searchValue,
}: {
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResultsType>>;
  peopleSearchResponse: PeopleSearchResponse;
  globalSearchResponse: GlobalSearchResponse;
  searchValue: string;
}) => {
  setSearchResults((prev) => {
    let newResults: SearchResultsType = prev;
    if (prev.searchTerm === searchValue) {
      newResults.user = {
        results: [...prev.user.results, ...peopleSearchResponse.data.results],
        totalResults: peopleSearchResponse.data.pagination.totalResults,
      };
      newResults.movie = {
        results: [
          ...prev.movie.results,
          ...globalSearchResponse.data.results.movie.data,
        ],
        totalResults: globalSearchResponse.data.results.movie.total,
      };
      newResults.series = {
        results: [
          ...prev.series.results,
          ...globalSearchResponse.data.results.series.data,
        ],
        totalResults: globalSearchResponse.data.results.series.total,
      };
      newResults.book = {
        results: [
          ...prev.book.results,
          ...globalSearchResponse.data.results.book.data,
        ],
        totalResults: globalSearchResponse.data.results.book.total,
      };
      newResults.music = {
        results: [
          ...prev.music.results,
          ...globalSearchResponse.data.results.music.data,
        ],
        totalResults: globalSearchResponse.data.results.music.total,
      };
      newResults.songs = {
        results: [
          ...prev.songs.results,
          ...globalSearchResponse.data.results.songs.data,
        ],
        totalResults: globalSearchResponse.data.results.songs.total,
      };
      newResults.album = {
        results: [
          ...prev.album.results,
          ...globalSearchResponse.data.results.album.data,
        ],
        totalResults: globalSearchResponse.data.results.album.total,
      };
      newResults.video = {
        results: [
          ...prev.video.results,
          ...globalSearchResponse.data.results.video.data,
        ],
        totalResults: globalSearchResponse.data.results.video.total,
      };
      newResults.people = {
        results: [
          ...prev.people.results,
          ...globalSearchResponse.data.results.people.data,
        ],
        totalResults: globalSearchResponse.data.results.people.total,
      };
      newResults.searchTerm = searchValue;
      return newResults;
    }
    newResults.user = {
      results: [...peopleSearchResponse.data.results],
      totalResults: peopleSearchResponse.data.pagination.totalResults,
    };
    newResults.movie = {
      results: [...globalSearchResponse.data.results.movie.data],
      totalResults: globalSearchResponse.data.results.movie.total,
    };
    newResults.series = {
      results: [...globalSearchResponse.data.results.series.data],
      totalResults: globalSearchResponse.data.results.series.total,
    };
    newResults.book = {
      results: [...globalSearchResponse.data.results.book.data],
      totalResults: globalSearchResponse.data.results.book.total,
    };
    newResults.music = {
      results: [...globalSearchResponse.data.results.music.data],
      totalResults: globalSearchResponse.data.results.music.total,
    };
    newResults.songs = {
      results: [...globalSearchResponse.data.results.songs.data],
      totalResults: globalSearchResponse.data.results.songs.total,
    };
    newResults.album = {
      results: [...globalSearchResponse.data.results.album.data],
      totalResults: globalSearchResponse.data.results.album.total,
    };
    newResults.video = {
      results: [...globalSearchResponse.data.results.video.data],
      totalResults: globalSearchResponse.data.results.video.total,
    };
    newResults.people = {
      results: [...globalSearchResponse.data.results.people.data],
      totalResults: globalSearchResponse.data.results.people.total,
    };
    newResults.searchTerm = searchValue;
    return newResults;
  });
};
