const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
    const query = `
    select a.*,b.name as author_name 
    from posts a join authors b on a.author_id = b.id `
    const [posts] = await db.query(query);
    res.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (req, res) {
    const [authors] = await db.query('select * from authors');
    res.render('create-post', { authors: authors });
});

router.post('/posts', async function (req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ];
    await db.query('insert into posts (title,summary,body,author_id) values( ? )', [data]);
    res.redirect('/posts');
});

router.get('/posts/:id', async function (req, res) {
    const query = `
    select a.*, b.name as author_name, b.email as author_email
    from posts a join authors b on a.author_id = b.id
    where a.id = ?
    `;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0) {
        return res.status(404).render('404');
    }

    const post_data = {
        ...posts[0],   //키값까지 쌍으로 가져옴
        date: posts[0].date.toISOString(),
        human_readable_date: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    };
    res.render('post-detail', { post: post_data });

});

router.get('/posts/:id/edit', async function (req, res) {
    const query = `
    select a.*
    from posts a 
    where a.id = ?
    `;
    const [posts] = await db.query(query, [req.params.id]);
    if (!posts || posts.length === 0) {
        return res.status(404).render('404');
    }

    res.render('update-post', { post: posts[0] });
});

router.post('/posts/:id/edit', async function (req, res) {
    const query = `
    update posts set title = ?, summary = ?, body =?
    where id = ?
    `;

    res.redirect('/posts');

    await db.query(query, [req.body.title, req.body.summary, req.body.content, req.params.id]);
})

router.post('/posts/:id/delete', async function (req, res) {
    await db.query('delete from posts where id = ?', [req.params.id]);
    res.redirect('/posts');
})

module.exports = router;
