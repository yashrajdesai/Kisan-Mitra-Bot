export const initialState = {
  userId: "",
  user: null,
  authReady: false
};

const reducer = (state, action) => {
  // console.log(action);
  switch (action.type) {
    case "SET_AUTH_READY":
      return {
        ...state,
        authReady: action.authReady
      }

    case "SET_USER_ID":
      return {
        ...state,
        userId: action.userId
      }
    
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }  

    default:
      return state;
  }
};

export default reducer;