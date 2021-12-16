const { post } = require("./user-routes");
const router = require("./user-routes");

router.put('/upvote', (req, res) => {
    // make sure the session exists first
    if(req.session) {
        // pass session id along with all destructured properties on req.body
        post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});