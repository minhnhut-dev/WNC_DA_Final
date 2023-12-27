const API_URL = "http://localhost:4000/";

function fixUrl(url) {
  return url.replace(/^\.\//, "");
}
export { API_URL, fixUrl };
