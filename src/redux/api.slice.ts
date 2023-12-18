import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GAME_SERVER_ENDPOINT } from "../../env";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: GAME_SERVER_ENDPOINT }),
    tagTypes: ["Game"],
    endpoints: (builder) => ({
        foo: builder.query({
            query: () => "/",
        }),
    }),
});
