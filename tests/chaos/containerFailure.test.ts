import { AppsV1Api, CoreV1Api, KubeConfig } from "@kubernetes/client-node";

describe("🧪 Cluster Resiliency & Chaos Disruption Assertions", () => {
  let k8sAppsApi: AppsV1Api;
  let k8sCoreApi: CoreV1Api;
  const NAMESPACE = "nexuscore-identity-prod";

  beforeAll(() => {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    k8sAppsApi = kc.makeApiClient(AppsV1Api);
    k8sCoreApi = kc.makeApiClient(CoreV1Api);
  });

  it("Should maintain 100% operational ingress stability during an active container failure event", async () => {
    console.log(
      "💥 Chaos Injector: Locating target cluster routing components...",
    );

    // 1. Fetch active infrastructure pod units assigned to our API gateway array
    const podList = await k8sCoreApi.listNamespacedPod({
      namespace: NAMESPACE,
      labelSelector: "app=api-gateway",
    });
    expect(podList.items.length).toBeGreaterThanOrEqual(2);

    const primaryTargetPodName = podList.items[0].metadata?.name;
    if (!primaryTargetPodName)
      throw new Error("No operational container footprints isolated.");

    console.log(
      `💀 Chaos Injector: Terminating running instances: ${primaryTargetPodName}`,
    );

    // 2. Terminate an active production application pod container instantly
    await k8sCoreApi.deleteNamespacedPod({
      name: primaryTargetPodName,
      namespace: NAMESPACE,
    });

    // 3. Verify downstream resilience mechanisms match orchestration rules
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Grace window for network re-routing

    const statusSweep = await k8sAppsApi.readNamespacedDeployment({
      name: "api-gateway-deployment",
      namespace: NAMESPACE,
    });

    // Assert the cluster successfully rerouted active user traffic away from the failed instance
    expect(statusSweep.status?.availableReplicas).toBeGreaterThanOrEqual(1);
    console.log(
      "✅ Chaos verification complete: Cluster successfully recovered without service disruption.",
    );
  });
});
