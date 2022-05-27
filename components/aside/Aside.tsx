import React from 'react';
import Image from 'next/image';

import useCurrentUser from 'hooks/useCurrentUser';
import { useMyFollowingsQuery } from 'graphql/generated';
import Profile from 'components/profile';

const Aside: React.FC = () => {
  const currentUser = useCurrentUser();

  const myFollowingsQuery = useMyFollowingsQuery({
    nextFetchPolicy: 'cache-only',
  });
  const myFollowings = myFollowingsQuery.data?.currentUser;

  if (!currentUser || !myFollowings) {
    return null;
  }

  return (
    <aside className="">
      <div className="py-8 px-6 bg-white rounded-lg shadow">
        <Profile
          userId={currentUser.id}
          followersCount={myFollowings.followers.totalCount}
          followingCount={myFollowings.followees.totalCount}
        />
      </div>
      <div className="py-4 px-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-sm font-semibold text-gray-600">Following</h3>
        <ul className="grid grid-cols-5 gap-2 p-0">
          {myFollowings.followees.edges.map(({ node }) => (
            <li key={node.id} className="flex flex-col items-center">
              <a className="block p-1 bg-white rounded-full" href="#">
                <Image
                  className="w-16 rounded-full"
                  width={128}
                  height={128}
                  src={node.image ?? ''}
                  alt=""
                />
              </a>
              <span className="text-xs text-center text-gray-500">
                {node.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
