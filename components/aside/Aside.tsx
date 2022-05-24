import React from 'react';
import Image from 'next/image';

import { User, useMyFollowingsQuery } from 'graphql/generated';
import Profile from 'components/profile';

interface Props {
  user: User;
}

const Aside: React.FC<Props> = ({ user }) => {
  const { data } = useMyFollowingsQuery();
  return (
    <aside className="">
      <div className="py-8 px-6 bg-white rounded-lg shadow">
        <Profile
          userId={user.id}
          followersCount={data?.currentUser?.followers.totalCount}
          followingCount={data?.currentUser?.followees.totalCount}
        />
      </div>
      <div className="py-4 px-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-sm font-semibold text-gray-600">Following</h3>
        <ul className="grid grid-cols-5 gap-2 p-0">
          {data?.currentUser?.followees.edges.map(({ node }) => (
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
