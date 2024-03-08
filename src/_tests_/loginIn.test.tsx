import { isLoggedIn } from "../utils";

describe("isLoggedIn function", () => {
    test("returns false when token_spawned is undefined", () => {
        // Now, you can test the isLoggedIn function
        expect(isLoggedIn()).toBe(false);
    });

    // Add more tests as needed
});
