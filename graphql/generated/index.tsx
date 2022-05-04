/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
};

export type Account = Node & {
  __typename?: 'Account';
  accountDetails: Scalars['JSON'];
  createdAt: Scalars['Datetime'];
  id: Scalars['UUID'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  provider: Scalars['String'];
  providerAccountId: Scalars['String'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `User` that is related to this `Account`. */
  user?: Maybe<User>;
  userId: Scalars['UUID'];
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `Account` object types. All fields are combined with a logical ‘and.’ */
export type AccountFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AccountFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** A list of `Account` objects. */
  nodes: Array<Account>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Account` at the end of the edge. */
  node: Account;
};

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** All input for the create `Tweet` mutation. */
export type CreateTweetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Tweet` to be created by this mutation. */
  tweet: TweetInput;
};

/** The output of our create `Tweet` mutation. */
export type CreateTweetPayload = {
  __typename?: 'CreateTweetPayload';
  /** Reads a single `User` that is related to this `Tweet`. */
  author?: Maybe<User>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tweet` that was created by this mutation. */
  tweet?: Maybe<Tweet>;
  /** An edge for our `Tweet`. May be used by Relay 1. */
  tweetEdge?: Maybe<TweetsEdge>;
};


/** The output of our create `Tweet` mutation. */
export type CreateTweetPayloadTweetEdgeArgs = {
  orderBy?: InputMaybe<Array<TweetsOrderBy>>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
};

/** All input for the `deleteAccountByNodeId` mutation. */
export type DeleteAccountByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  __typename?: 'DeleteAccountPayload';
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedAccountNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Account`. */
  user?: Maybe<User>;
};


/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteTweetByNodeId` mutation. */
export type DeleteTweetByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Tweet` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteTweet` mutation. */
export type DeleteTweetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `Tweet` mutation. */
export type DeleteTweetPayload = {
  __typename?: 'DeleteTweetPayload';
  /** Reads a single `User` that is related to this `Tweet`. */
  author?: Maybe<User>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTweetNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tweet` that was deleted by this mutation. */
  tweet?: Maybe<Tweet>;
  /** An edge for our `Tweet`. May be used by Relay 1. */
  tweetEdge?: Maybe<TweetsEdge>;
};


/** The output of our delete `Tweet` mutation. */
export type DeleteTweetPayloadTweetEdgeArgs = {
  orderBy?: InputMaybe<Array<TweetsOrderBy>>;
};

export type ListenPayload = {
  __typename?: 'ListenPayload';
  /** Our root query field type. Allows us to run any query from our subscription payload. */
  query?: Maybe<Query>;
  relatedNode?: Maybe<Node>;
  relatedNodeId?: Maybe<Scalars['ID']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Tweet`. */
  createTweet?: Maybe<CreateTweetPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccountByNodeId?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Tweet` using a unique key. */
  deleteTweet?: Maybe<DeleteTweetPayload>;
  /** Deletes a single `Tweet` using its globally unique id. */
  deleteTweetByNodeId?: Maybe<DeleteTweetPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserByNodeId?: Maybe<UpdateUserPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTweetArgs = {
  input: CreateTweetInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByNodeIdArgs = {
  input: DeleteAccountByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTweetArgs = {
  input: DeleteTweetInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTweetByNodeIdArgs = {
  input: DeleteTweetByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByNodeIdArgs = {
  input: UpdateUserByNodeIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  account?: Maybe<Account>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountsConnection>;
  /** The currently logged in user (or null if not logged in). */
  currentUser?: Maybe<User>;
  /** Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead. */
  currentUserId?: Maybe<Scalars['UUID']>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  tweet?: Maybe<Tweet>;
  /** Reads a single `Tweet` using its globally unique `ID`. */
  tweetByNodeId?: Maybe<Tweet>;
  /** Reads and enables pagination through a set of `Tweet`. */
  tweets?: Maybe<TweetsConnection>;
  user?: Maybe<User>;
  /** Reads a single `User` using its globally unique `ID`. */
  userByNodeId?: Maybe<User>;
  userByUsername?: Maybe<User>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AccountCondition>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTweetArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTweetByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTweetsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TweetCondition>;
  filter?: InputMaybe<TweetFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TweetsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByUsernameArgs = {
  username: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<UserCondition>;
  filter?: InputMaybe<UserFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  listen: ListenPayload;
};


/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type SubscriptionListenArgs = {
  topic: Scalars['String'];
};

export type Tweet = Node & {
  __typename?: 'Tweet';
  /** Reads a single `User` that is related to this `Tweet`. */
  author?: Maybe<User>;
  authorId: Scalars['UUID'];
  createdAt: Scalars['Datetime'];
  id: Scalars['UUID'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  text: Scalars['String'];
  updatedAt: Scalars['Datetime'];
};

/** A condition to be used against `Tweet` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TweetCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `Tweet` object types. All fields are combined with a logical ‘and.’ */
export type TweetFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TweetFilter>>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TweetFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TweetFilter>>;
};

/** An input for mutations affecting `Tweet` */
export type TweetInput = {
  text: Scalars['String'];
};

/** A connection to a list of `Tweet` values. */
export type TweetsConnection = {
  __typename?: 'TweetsConnection';
  /** A list of edges which contains the `Tweet` and cursor to aid in pagination. */
  edges: Array<TweetsEdge>;
  /** A list of `Tweet` objects. */
  nodes: Array<Tweet>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tweet` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Tweet` edge in the connection. */
export type TweetsEdge = {
  __typename?: 'TweetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tweet` at the end of the edge. */
  node: Tweet;
};

/** Methods to use when ordering `Tweet`. */
export enum TweetsOrderBy {
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']>>;
};

/** All input for the `updateUserByNodeId` mutation. */
export type UpdateUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** A user who can log in to the application. */
export type User = Node & {
  __typename?: 'User';
  /** Reads and enables pagination through a set of `Account`. */
  accounts: AccountsConnection;
  /** Reads and enables pagination through a set of `Tweet`. */
  authoredTweets: TweetsConnection;
  createdAt: Scalars['Datetime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  updatedAt: Scalars['Datetime'];
  /** Unique name. */
  username?: Maybe<Scalars['String']>;
};


/** A user who can log in to the application. */
export type UserAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AccountCondition>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


/** A user who can log in to the application. */
export type UserAuthoredTweetsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TweetCondition>;
  filter?: InputMaybe<TweetFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TweetsOrderBy>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  /** Unique name. */
  username?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC'
}

export type TweetFragmentFragment = { __typename?: 'Tweet', id: any, text: string, createdAt: any, author?: { __typename?: 'User', id: any, name?: string | null, image?: string | null } | null };

export type TweetsQueryVariables = Exact<{ [key: string]: never; }>;


export type TweetsQuery = { __typename?: 'Query', tweets?: { __typename?: 'TweetsConnection', edges: Array<{ __typename?: 'TweetsEdge', node: { __typename?: 'Tweet', id: any, text: string, createdAt: any, author?: { __typename?: 'User', id: any, name?: string | null, image?: string | null } | null } }> } | null };

export type CreateTweetMutationVariables = Exact<{
  text: Scalars['String'];
}>;


export type CreateTweetMutation = { __typename?: 'Mutation', createTweet?: { __typename?: 'CreateTweetPayload', tweetEdge?: { __typename?: 'TweetsEdge', node: { __typename?: 'Tweet', id: any, text: string, createdAt: any, author?: { __typename?: 'User', id: any, name?: string | null, image?: string | null } | null } } | null } | null };

export type NewTweetSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewTweetSubscription = { __typename?: 'Subscription', listen: { __typename?: 'ListenPayload', relatedNode?: { __typename?: 'Account' } | { __typename?: 'Query' } | { __typename?: 'Tweet', id: any, text: string, createdAt: any, author?: { __typename?: 'User', id: any, name?: string | null, image?: string | null } | null } | { __typename?: 'User' } | null } };

export const TweetFragmentFragmentDoc = gql`
    fragment TweetFragment on Tweet {
  id
  text
  author {
    id
    name
    image
  }
  createdAt
}
    `;
export const TweetsDocument = gql`
    query Tweets {
  tweets(first: 50) {
    edges {
      node {
        ...TweetFragment
      }
    }
  }
}
    ${TweetFragmentFragmentDoc}`;

/**
 * __useTweetsQuery__
 *
 * To run a query within a React component, call `useTweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTweetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTweetsQuery(baseOptions?: Apollo.QueryHookOptions<TweetsQuery, TweetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TweetsQuery, TweetsQueryVariables>(TweetsDocument, options);
      }
export function useTweetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TweetsQuery, TweetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TweetsQuery, TweetsQueryVariables>(TweetsDocument, options);
        }
export type TweetsQueryHookResult = ReturnType<typeof useTweetsQuery>;
export type TweetsLazyQueryHookResult = ReturnType<typeof useTweetsLazyQuery>;
export type TweetsQueryResult = Apollo.QueryResult<TweetsQuery, TweetsQueryVariables>;
export const CreateTweetDocument = gql`
    mutation CreateTweet($text: String!) {
  createTweet(input: {tweet: {text: $text}}) {
    tweetEdge {
      node {
        ...TweetFragment
      }
    }
  }
}
    ${TweetFragmentFragmentDoc}`;
export type CreateTweetMutationFn = Apollo.MutationFunction<CreateTweetMutation, CreateTweetMutationVariables>;

/**
 * __useCreateTweetMutation__
 *
 * To run a mutation, you first call `useCreateTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTweetMutation, { data, loading, error }] = useCreateTweetMutation({
 *   variables: {
 *      text: // value for 'text'
 *   },
 * });
 */
export function useCreateTweetMutation(baseOptions?: Apollo.MutationHookOptions<CreateTweetMutation, CreateTweetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTweetMutation, CreateTweetMutationVariables>(CreateTweetDocument, options);
      }
export type CreateTweetMutationHookResult = ReturnType<typeof useCreateTweetMutation>;
export type CreateTweetMutationResult = Apollo.MutationResult<CreateTweetMutation>;
export type CreateTweetMutationOptions = Apollo.BaseMutationOptions<CreateTweetMutation, CreateTweetMutationVariables>;
export const NewTweetDocument = gql`
    subscription NewTweet {
  listen(topic: "newTweet") {
    relatedNode {
      ...TweetFragment
    }
  }
}
    ${TweetFragmentFragmentDoc}`;

/**
 * __useNewTweetSubscription__
 *
 * To run a query within a React component, call `useNewTweetSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewTweetSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewTweetSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewTweetSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewTweetSubscription, NewTweetSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewTweetSubscription, NewTweetSubscriptionVariables>(NewTweetDocument, options);
      }
export type NewTweetSubscriptionHookResult = ReturnType<typeof useNewTweetSubscription>;
export type NewTweetSubscriptionResult = Apollo.SubscriptionResult<NewTweetSubscription>;