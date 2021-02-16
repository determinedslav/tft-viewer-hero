import client from "./apollo-client"
import types from "./graphql-types"

export default {
    async getUser(email, password) {
        try {
            const response = await client.query({
                variables: {email, password},
                query: types.GET_USER,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async addUser(email, username, password) {
        try{
            const response = await client.mutate({
                variables: { email, username, password },
                mutation: types.ADD_USER,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async addAccount(_id, account) {
        try {
            const response = await client.mutate({
                variables: { _id, account },
                mutation: types.ADD_ACCOUNT,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async editUserUsername(_id, username) {
        try {
            const response = await client.mutate({
                variables: { _id, username },
                mutation: types.EDIT_USER_USERNAME,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async editUserPassword(_id, oldPassword, password) {
        try {
            const response = await client.mutate({
                variables: { _id, oldPassword, password },
                mutation: types.EDIT_USER_PASSWORD,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async addFriend(_id, friend) {
        try {
            const response = await client.mutate({
                variables: { _id, friend },
                mutation: types.ADD_FRIEND,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async removeFriend(_id, friend) {
        try {
            const response = await client.mutate({
                variables: { _id, friend },
                mutation: types.REMOVE_FRIEND,
            });
        return response;
        } catch (error) {
            return error;
        }
    },

    async deleteUser(_id) {
        try {
        const response = await client.mutate({
            variables: { _id },
            mutation: types.DELETE_USER,
        });
        return response;
        } catch (error) {
            return error;
        }
    },
}