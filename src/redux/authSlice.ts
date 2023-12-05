import { apiSlice } from ".";
export const authSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        authenticateGame: builder.mutation({
            query: (arg: {username: string, password: string}) => ({
                url: `auth/user`,
                method: 'POST',
                body: JSON.stringify(arg),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            // invalidatesTags: ['Game'],
            transformResponse: (response: {token: string})  => response
        }),
        createGameSession: builder.mutation({
            query: (arg: {token: string}) => ({
                url: `game/session/create`,
                method: 'POST',
                body: JSON.stringify(arg),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            transformResponse: (response: {session_id: string})  => response
        }),
    })
})

export const {
    useAuthenticateGameMutation,
    useCreateGameSessionMutation
} = authSlice