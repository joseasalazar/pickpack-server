// Construct a schema, using GraphQL schema language
const { gql } = require("apollo-server");

const typeDefs = gql`
  # scalar Date

  # type Tour {
  #   tourId: ID
  #   tourName: String
  #   tourPrice: Int
  #   tourDiscount: Int
  #   tourStartDate: Date
  #   tourEndDate: Date
  #   tourType: String
  #   tourQuantity: Int
  #   tourStatus: Int
  #   tourPhoto: [TourPhoto]
  # }

  # type TourProvider {
  #   tourProviderId: ID
  #   tourProviderName: String
  #   tourProviderEmail: String
  #   tourId: [Tour]
  # }

  # type TourPhoto {
  #   tourPhotoId: ID
  #   tourPhotoURL: String
  # }

  # type Order {
  #   orderId: ID
  #   orderItems: [OrderItem]!
  #   customerIds: [Customer]!
  #   orderDate: Date!
  # }

  # type OrderItem {
  #   orderItemId: ID
  #   tourId: Tour!
  #   itemQuantity: Int!
  #   itemPrice: Int!
  # }

  # # type User {
  # #   userId: ID
  # #   type: Int
  # #   firstName: String
  # #   lastName: String
  # #   email: String
  # #   password: String
  # # }

  # type UserPayment {
  #   userPaymentId: ID
  #   userId: User!
  #   paymentDate: Date!
  #   oderId: Order!
  # }

  type User {
    ID: String
    email: String
    country: String
  }
  type Query {
    user(ID: String!): User
  }
  type Mutation {
    createUser(email: String): Boolean
    updateUser(ID: String, country: String): User
  }
`;

module.exports = typeDefs;
