import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json';

const app = new Hono();

let blogPosts = [
  {
    id: "1",
    title: 'blog1',
    content: 'blog1 Post',
  },
  {
    id: "2",
    title: 'blog2',
    content: 'blog2 Post',
  },
  {
    id: "3",
    title: 'blog3',
    content: 'blog3 Post',
  },
];

app.use("*", prettyJSON());

app.get('/', (c) => {
  return c.html("<h1>Hello Hono!</h1>")
});

// Read All
app.get('/posts', (c) => c.json({posts: blogPosts}));

// Read One
app.get('/posts/:id', (c) => {
  const id = c.req.param('id');
  const post = blogPosts.find((p) => p.id ===id);

  if(post) {
    return c.json(post);
  }else {
    return c.json({ message: "not found this page"}, 404);
  }
});

// Create
app.post('/posts', async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const newPost = { id: String(blogPosts.length + 1), title, content };
  blogPosts = [...blogPosts, newPost];
  return c.json(newPost);
  });

// Update
app.put('/posts/:id', async (c) => {
  const id = c.req.param('id');
  const index = blogPosts.findIndex((p) => p.id === id);

  if(index === -1) {
    return c.json({ message: "Post not found"}, 404);
  }
  
  const { title, content } = await c.req.json();
  blogPosts[index] = { ...blogPosts[index], title, content };

  return c.json(blogPosts[index]);
});

// delete
app.delete('/posts/:id', async (c) => {
  const id = c.req.param('id');
  const index = blogPosts.findIndex((p) => p.id === id);

  if(index === -1) {
    return c.json({ message: "Post not found"}, 404);
  }
  
  blogPosts = blogPosts.filter((p) => p.id !== id);

  return c.json({ message: "Blog post Deleted" });
});

export default app
