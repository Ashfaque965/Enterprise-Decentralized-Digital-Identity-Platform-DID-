import { check, sleep } from "k6";
import http from "k6/http";

// Configure traffic spike characteristics targeting peak baseline evaluation metrics
export const options = {
  stages: [
    { duration: "30s", target: 200 }, // Ramps up quickly to 200 concurrent device threads
    { duration: "1m", target: 200 }, // Sustains load to verify database pooling saturation limits
    { duration: "15s", target: 0 }, // Cooldown and socket draining period
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // Enterprise threshold: Drop rate must be less than 1%
    http_req_duration: ["p(95)<250"], // 95% of queries must resolve in under 250 milliseconds
  },
};

export default function () {
  const url =
    "https://identity.nexuscore.network/api/v1/openid/presentation-request";

  const headers = {
    "Content-Type": "application/json",
    "X-Hardware-Enclave": "true",
  };

  const response = http.get(url, { headers: headers });

  // Assert target route stability indicators match code standards
  check(response, {
    "status equals 200": (r) => r.status === 200,
    "contains authorization link token": (r) =>
      r.body.includes("openid-4-verifiable-presentations://"),
  });

  sleep(1); // Simulates standard human scanning friction delay parameters
}
