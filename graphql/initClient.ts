import { createClient } from "urql";

const APIURL = "https://api.lens.dev";

/* create the API client */
const client = createClient({
  url: APIURL,
});

export default client;
