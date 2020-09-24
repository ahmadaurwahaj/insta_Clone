import {
  GET_STORIES_FAILURE,
  GET_STORIES_SUCCESS,
  GET_STORIES_REQUEST,
} from "../Actions/stories";

const storiesState = {
  gettingData: false,
  recieveData: false,
  dataFailure: false,
  stories: [],
};

export default (state = storiesState, action) => {
  switch (action.type) {
    case GET_STORIES_REQUEST:
      return {
        ...state,
        gettingData: true,
      };
    case GET_STORIES_SUCCESS:
      return {
        ...state,
        gettingData: false,
        recieveData: true,
        stories: [...state.stories, action.stories],
      };

    case GET_STORIES_FAILURE:
      return {
        gettingData: false,
        recieveData: false,
        dataFailure: true,
        stories: [],
      };

    default:
      return state;
  }
};
