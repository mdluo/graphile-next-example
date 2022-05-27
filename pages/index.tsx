import { useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';

import Nav from 'components/nav';
import Aside from 'components/aside';
import Composer from 'components/composer';
import Post from 'components/post';
import {
  usePostsQuery,
  useCreatePostMutation,
  useNewPostSubscription,
} from 'graphql/generated';

const Index: React.FC = () => {
  useSession({
    required: true,
    onUnauthenticated: signIn,
  });

  const { data, updateQuery } = usePostsQuery();

  useNewPostSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      const relatedNode = subscriptionData.data?.listen.relatedNode;
      if (relatedNode?.__typename === 'Post') {
        updateQuery((prev) => {
          return {
            ...prev,
            posts: {
              ...prev.posts,
              edges: [relatedNode, ...(prev.posts?.edges ?? [])],
            },
          } as typeof prev;
        });
      }
    },
  });

  const [createPostMutation] = useCreatePostMutation();
  const onSubmit = useCallback(
    async (text: string) => {
      const { data } = await createPostMutation({
        variables: { text },
      });
      const newPost = data?.createPost?.postEdge;
      if (newPost) {
        updateQuery((prev) => {
          return {
            ...prev,
            posts: {
              ...prev.posts,
              edges: [newPost, ...(prev.posts?.edges ?? [])],
            },
          } as typeof prev;
        });
      }
    },
    [createPostMutation, updateQuery],
  );

  return (
    <>
      <style>{`button { border: none; cursor: pointer; }`}</style>
      <Nav />
      <div className="container grid grid-cols-1 gap-6 py-6 px-2 mx-auto lg:grid-cols-3">
        <Aside />
        <main className="col-span-2">
          <Composer onSubmit={onSubmit} />
          {data?.posts?.edges?.map(({ node }) => (
            <Post key={node.id} post={node} />
          ))}
        </main>
      </div>
    </>
  );
};

export default Index;
