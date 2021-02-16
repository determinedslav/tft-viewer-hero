import ApolloClient from 'apollo-boost';
import GraphQL from "../constants/GraphQL"

export default new ApolloClient({
  uri: GraphQL.graphQLURL,
});
