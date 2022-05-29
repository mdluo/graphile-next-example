import { useSession, signIn } from 'next-auth/react';
import { merge } from 'lodash';

import Nav from 'components/nav';
import Aside from 'components/aside';
import Composer from 'components/composer';
import Post from 'components/post';
import { usePostsQuery, useNewPostSubscription } from 'graphql/generated';

const Index: React.FC = () => {
  useSession({
    required: true,
    onUnauthenticated: signIn,
  });

  const { data, loading, fetchMore, updateQuery } = usePostsQuery({
    variables: { first: 10 },
  });

  useNewPostSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      const relatedNode = subscriptionData.data?.listen.relatedNode;
      if (relatedNode?.__typename === 'Post') {
        const newPost = relatedNode;
        updateQuery((prev) => {
          if (prev.posts?.edges.find((edge) => edge.node.id === newPost.id)) {
            return prev;
          }
          return merge({}, prev, {
            posts: {
              totalCount: prev.posts?.totalCount ?? 0 + 1,
              edges: [{ node: newPost }, ...(prev.posts?.edges ?? [])],
            },
          });
        });
      }
    },
  });

  return (
    <>
      <style>{`button { border: none; cursor: pointer; }`}</style>
      <Nav />
      <div className="container grid grid-cols-1 gap-6 py-6 px-2 mx-auto lg:grid-cols-3">
        <Aside />
        <main className="col-span-2">
          <Composer />
          {data?.posts?.edges?.map(({ node }) => (
            <Post key={node.id} post={node} />
          ))}
          {data?.posts?.pageInfo.hasNextPage && !loading && (
            <button
              className="py-2 w-full text-white bg-blue-400 hover:bg-blue-500 rounded-md transition duration-300 ease-out cursor-pointer"
              onClick={() =>
                fetchMore({
                  variables: {
                    after: data.posts?.pageInfo.endCursor,
                  },
                })
              }
            >
              Load more
            </button>
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
