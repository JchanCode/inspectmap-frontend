import keys from "./keys"

const config = { 
  MY_APP_TOKEN : keys.APP_TOKEN,
  NYC_RESTA_API_URL: "https://data.cityofnewyork.us/resource/43nn-pn8j.json?",
  RADIUS_SMALL : 0.003,
  RADIUS_MID : 0.007,
  RADIUS_LARGE : 0.1,
  INIT_SEARCH_STATE : {
    searchTerm : "",
    boro: ""
  },
  TOKEN_STORAGE_KEY : "inspectMap-token",
  INIT_NOTIF_STATE : {
    type: null,
    username:null,
  }
};


export default config