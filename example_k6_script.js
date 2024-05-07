import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

// Two custom metrics to track data sent and received. We will tag data points added with the corresponding URL
// so we can filter these metrics down to see the data for individual URLs and set threshold across all or per-URL as well.
export const epDataSent = new Counter("endpoint_data_sent");
export const epDataRecv = new Counter("endpoint_data_recv");

// Set the URL parameters
var params = {
  headers: {
    // "Authorization": "ApiKey PLACEHOLDER_API_KEY",
    "Content-Type": "application/json",
  },
  redirects: 0,
};

var url = "http://127.0.0.1:5100/v1/ner-lite";

export const options = {
  duration: "10s",
  vus: 10,
};

function sizeOfHeaders(hdrs) {
  return Object.keys(hdrs).reduce(
    (sum, key) => sum + key.length + hdrs[key].length,
    0
  );
}

function trackDataMetricsPerURL(res) {
  // Add data points for sent and received data
  epDataSent.add(sizeOfHeaders(res.request.headers) + res.request.body.length, {
    url: res.url,
    name: res.url,
  });
  epDataRecv.add(sizeOfHeaders(res.headers) + res.body.length, {
    url: res.url,
    name: res.url,
  });
}

export default function () {
  let res;

  res = http.get(url, params);

  trackDataMetricsPerURL(res);
  check(res, {
    "status was 200": (r) => r.status == 200,
    "transaction time OK": (r) => r.timings.duration < 2000,
  });

  sleep(0.1);
}
