import React, { useRef, useState, useCallback } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import { merge } from 'lodash';

import { usePostsQuery, useCreatePostMutation } from 'graphql/generated';

const Composer: React.FC = () => {
  const textarea = useRef<HTMLTextAreaElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      fetch('https://api.imgur.com/3/image', {
        method: 'post',
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const { updateQuery } = usePostsQuery({ skip: true });
  const [createPostMutation] = useCreatePostMutation();

  const onSubmit = useCallback(
    async (text: string) => {
      await createPostMutation({
        variables: { text },
        update: (_cache, { data }) => {
          updateQuery((prev) => {
            const newPost = data?.createPost?.post;
            if (!newPost) {
              return prev;
            }
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
        },
      });
    },
    [createPostMutation, updateQuery],
  );

  return (
    <form
      className="p-4 mb-6 bg-white rounded-lg shadow"
      onSubmit={async (e) => {
        e.preventDefault();
        if (textarea.current?.value) {
          setSubmitting(true);
          await onSubmit(textarea.current.value);
          setSubmitting(false);
          textarea.current.value = '';
        }
      }}
    >
      <textarea
        ref={textarea}
        name="message"
        placeholder="Type something..."
        className="p-2 w-full min-h-[2.5rem] text-sm placeholder:text-gray-400 bg-gray-100 rounded-lg border border-transparent appearance-none resize-y"
        disabled={submitting}
        defaultValue={''}
      />
      <footer className="flex justify-between mt-2">
        <div className="flex gap-2">
          <span
            className="flex items-center px-2 w-8 h-8 text-blue-400 hover:text-white bg-blue-100 hover:bg-blue-500 rounded-full transition duration-300 ease-out cursor-pointer"
            onClick={() => {
              fileInput.current?.click();
            }}
          >
            <input
              onChange={onChange}
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
            ></input>
            <Icon icon="media" />
          </span>
          <span className="flex items-center px-2 w-8 h-8 text-blue-400 hover:text-white bg-blue-100 hover:bg-blue-500 rounded-full transition duration-300 ease-out cursor-pointer">
            <Icon icon="add-location" />
          </span>
          <span className="flex items-center px-2 w-8 h-8 text-blue-400 hover:text-white bg-blue-100 hover:bg-blue-500 rounded-full transition duration-300 ease-out cursor-pointer">
            <Icon icon="code" />
          </span>
        </div>
        <Button
          intent="primary"
          className="py-[10px] px-3 rounded-lg"
          loading={submitting}
          rightIcon="send-message"
          type="submit"
        >
          Post
        </Button>
      </footer>
    </form>
  );
};

export default Composer;
