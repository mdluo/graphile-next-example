import React from 'react';
import Image from 'next/image';
import { Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import useCurrentUser from 'hooks/useCurrentUser';
import { formatTimeAgo, dtf } from 'libs/format';
import Profile from 'components/profile';
import { PostsQuery } from 'graphql/generated';

interface Props {
  post: NonNullable<PostsQuery['posts']>['edges'][number]['node'];
}

const Post: React.FC<Props> = ({ post }) => {
  const currentUser = useCurrentUser();

  if (!currentUser || !post) {
    return null;
  }

  return (
    <article className="mb-6 bg-white rounded-lg shadow">
      <div className="flex flex-row py-3 px-2 mx-3">
        <div className="w-auto h-auto rounded-full">
          <Popover2
            className="rounded"
            placement="right-start"
            content={
              <div className="py-6 px-3">
                <Profile userId={post.author?.id} />
              </div>
            }
          >
            <Image
              className="object-cover w-12 h-12 rounded-full shadow cursor-pointer"
              width={48}
              height={48}
              src={post.author?.image ?? ''}
              alt="User avatar"
            />
          </Popover2>
        </div>
        <div className="flex flex-col mt-1 mb-2 ml-4">
          <div className="text-sm font-semibold text-gray-600">
            {post.author?.name}
          </div>
          <div className="flex mt-1 w-full">
            <div
              className="text-xs text-gray-400"
              title={dtf.format(new Date(post.createdAt))}
            >
              {formatTimeAgo(new Date(post.createdAt))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-100" />
      <div className="px-2 mx-3 mb-6 text-base">{post.text}</div>

      <div className="flex w-full border-t border-gray-100">
        <div className="flex flex-row mx-5 mt-3 text-xs">
          <div className="flex items-center mr-4 mb-2 font-normal text-gray-700 rounded-md">
            Comments:
            <div className="ml-1 text-gray-400">0</div>
          </div>
          <div className="flex items-center mr-4 mb-2 font-normal text-gray-700 rounded-md">
            Views:
            <div className="ml-1 text-gray-400">0</div>
          </div>
        </div>
        <div className="flex justify-end mx-5 mt-3 w-full text-xs">
          <div className="flex items-center  mr-4 mb-2 text-gray-700 rounded-md">
            Likes:
            <div className="ml-1 text-gray-400">0</div>
          </div>
        </div>
      </div>
      <div className="flex overflow-hidden relative gap-2 items-center self-center p-4 w-full text-gray-600 focus-within:text-gray-400">
        <Image
          className="object-cover mr-2 w-10 h-10 rounded-full shadow cursor-pointer"
          width={40}
          height={40}
          src={currentUser.image ?? ''}
          alt="User avatar"
        />
        <span className="flex absolute inset-y-0 right-0 items-center pr-6">
          <button
            type="submit"
            className="p-1 hover:text-blue-500 focus:outline-none focus:shadow-none"
          >
            <Icon icon="emoji" />
          </button>
        </span>
        <input
          type="search"
          className="py-2 pr-10 pl-4 w-full text-sm placeholder:text-gray-400 bg-gray-100 rounded-lg border border-transparent appearance-none"
          style={{ borderRadius: 25 }}
          placeholder="Post a comment..."
          autoComplete="off"
        />
      </div>
    </article>
  );
};

export default Post;
