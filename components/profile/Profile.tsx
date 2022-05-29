import React from 'react';
import Image from 'next/image';
import { Icon, Button } from '@blueprintjs/core';

import useCurrentUser from 'hooks/useCurrentUser';
import {
  useUserQuery,
  useIsFollowingQuery,
  useFollowMutation,
  useUnFollowMutation,
} from 'graphql/generated';

interface Props {
  userId: string;
  followersCount?: number;
  followingCount?: number;
}

const Profile: React.FC<Props> = ({
  userId,
  followersCount,
  followingCount,
}) => {
  const currentUser = useCurrentUser();
  const myUserId = currentUser?.id;

  const isMe = userId === myUserId;

  const userQuery = useUserQuery({ variables: { id: userId }, skip: isMe });
  const user = isMe ? currentUser : userQuery.data?.user;

  const {
    data: isFollowingData,
    loading: isFollowingLoading,
    updateQuery: updateIsFollowingQuery,
  } = useIsFollowingQuery({
    variables: { followerId: myUserId, followeeId: userId },
    skip: isMe,
  });
  const isFollowing = isFollowingLoading
    ? null
    : !!isFollowingData?.following?.followeeId;

  const [follow, { loading: followLoading }] = useFollowMutation({
    variables: { followeeId: userId },
    refetchQueries: ['MyFollowings'],
    update: () => {
      updateIsFollowingQuery(() => ({
        following: {
          followeeId: userId,
        },
      }));
    },
  });

  const [unfollow, { loading: unfollowLoading }] = useUnFollowMutation({
    variables: { followerId: myUserId, followeeId: userId },
    refetchQueries: ['MyFollowings'],
    update: () => {
      updateIsFollowingQuery(() => ({
        following: null,
      }));
    },
  });

  if (!currentUser || !user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="flex justify-center items-center p-2 rounded-full shadow">
          <Image
            className="p-2 rounded-full"
            width={100}
            height={100}
            src={user.image ?? ''}
            alt=""
          />
        </div>
        <p className="text-lg font-semibold">{user.name}</p>
        <div className="flex justify-center items-center text-sm leading-normal text-gray-400">
          <Icon icon="citation" />
          {user.description}
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <div className="mx-4 font-semibold text-center">
          <p className="text-black">{user.authoredPosts.totalCount}</p>
          <span className="text-gray-400">Posts</span>
        </div>
        <div className="mx-4 font-semibold text-center">
          <p className="text-black">
            {followersCount ?? user.followers.totalCount}
          </p>
          <span className="text-gray-400">Followers</span>
        </div>
        <div className="mx-4 font-semibold text-center">
          <p className="text-black">
            {followingCount ?? user.followees.totalCount}
          </p>
          <span className="text-gray-400">Following</span>
        </div>
      </div>
      {!isMe && isFollowing !== null && (
        <Button
          intent={isFollowing ? 'none' : 'primary'}
          loading={followLoading || unfollowLoading}
          onClick={() => {
            isFollowing ? unfollow() : follow();
          }}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </div>
  );
};

export default Profile;
