const router = require('express').Router();
const { User } = require('../../models');

// GET/api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll()
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET/api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ mnessage: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST/api/users
router.get('/post/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id'), 'vote_count'],
            include: [
                {
                model: Comment,
                attributes: ['username']
            }
            },
            ]
        ]
    }).then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No user with that email address!' });
                    return;
                }

                const validPassword = dbUserData.checkpassword(req.body.password);

                if (!validPassword) {
                    res.status(400).json({ message: 'Incorrect password!' });
                    return;
                }


                res.session.save(() => {
                    // declare session variables
                    req.session.user_id = dbUserData.id;
                    req.session.username = dbUserData.username;
                    req.session.loggedIn = true;

                    res.json({ user: dbUserData, message: 'You are now logged in!' });
                });
            });

router.post('/logout', (req, res) => {

});
if (req.session.loggedIn) {
    req.session.destroy(() => {
        res.status(204).end();
    });
} else {
    res.status(404).end();
}

// PUT/api/users/1
router.put('./:id', (req, res) => {
    // expects {username: 'lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body`instead
    User.update(req.body, {
        where: {
            id: req.params.id
        }
            .then(dbUserData => {
                if (!dbUserData[0]) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    })
});


// DELETE/api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUsesrData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;