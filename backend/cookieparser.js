const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'], // array of keys for rotation
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// set data
app.use((req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Views: ${req.session.views}`);
});
