import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, TextArea } from '@blueprintjs/core';

import {
  useTweetsQuery,
  useCreateTweetMutation,
  useNewTweetSubscription,
} from 'graphql/generated';

const Index: React.FC = () => {
  const session = useSession({
    required: true,
    onUnauthenticated: signIn,
  });

  const { loading, error, data, updateQuery } = useTweetsQuery();

  useNewTweetSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      const relatedNode = subscriptionData.data?.listen.relatedNode;
      if (relatedNode?.__typename === 'Tweet') {
        console.log('new tweet', relatedNode);
      }
    },
  });

  const [text, setText] = useState('');
  const [createTweetMutation] = useCreateTweetMutation();

  if (!session || session.status === 'loading' || loading || error) {
    return null;
  }

  return (
    <div className="container py-3 mx-auto">
      <Button className="mb-2" onClick={() => signOut()}>
        Logout
      </Button>
      <p>Hello {session.data.user?.name}</p>
      <TextArea
        large={true}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        onClick={async () => {
          const { data } = await createTweetMutation({ variables: { text } });
          const newTweet = data?.createTweet?.tweetEdge;
          if (newTweet) {
            updateQuery((prev) => {
              return {
                ...prev,
                tweets: {
                  ...prev.tweets,
                  edges: [newTweet, ...(prev.tweets?.edges ?? [])],
                },
              } as typeof prev;
            });
          }
        }}
      >
        Post
      </Button>
      <ul>
        {data?.tweets?.edges?.map(({ node }) => (
          <li key={node.id} className="truncate">
            {node.text} - {node.author?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
