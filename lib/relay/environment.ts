import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { fetchQuery } from "./fetchGraphQL";

function createEnvironment() {
  return new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
    isServer: typeof window === "undefined",
  });
}

let environment: Environment | undefined;

export function getClientEnvironment() {
  if (typeof window === "undefined") {
    return createEnvironment();
  }

  if (!environment) {
    environment = createEnvironment();
  }

  return environment;
}
