import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';

import { Grid } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);
  let posts = [];
  if (data) {
    posts = data.getPosts;
  }

  return (
    <Grid columns={3} divided>
      <Grid.Row className="page-title">
        <h1>Posts Feed</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h2>Loading posts...</h2>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
