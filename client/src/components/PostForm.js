import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { useForm } from '../utils/hooks';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallBack, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = '';
    },
  });

  function createPostCallBack() {
    createPost();
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>What's on your mind?</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            values={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Create
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
export default PostForm;
