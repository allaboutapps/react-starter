import { expect, it } from "vitest";

// Test static env vars exist. More of a dummy test to make sure jest setup is working.
it("test static env", () => {
    expect(import.meta.env.VITE_API_BASE_URL).toEqual("TEST_API_BASE_URL");
    expect(import.meta.env.VITE_BASE_NAME).toEqual("/test");
    expect(import.meta.env.VITE_DEPLOYMENT_ENV).toEqual("test-env");
});
