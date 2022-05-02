import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { Button } from '@blueprintjs/core';

const TIMELINE_QUERY = gql`
  query Timeline {
    tweets(first: 50) {
      edges {
        node {
          id
          text
          createdAt
          author {
            id
            name
          }
        }
      }
    }
  }
`;

const Index: React.FC = () => {
  const router = useRouter();

  const session = useSession({
    required: true,
    onUnauthenticated: signIn,
  });

  const { loading, error, data } = useQuery(TIMELINE_QUERY);

  if (!session || session.status === 'loading' || loading || error) {
    return null;
  }

  return (
    <div className="container py-3 mx-auto">
      <Button className="mb-2" onClick={() => router.push('/404')}>
        Test
      </Button>

      <Button className="mb-2" onClick={() => signOut()}>
        Logout
      </Button>
      <p>Hello {session.data.user?.name}</p>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
};

export default Index;
