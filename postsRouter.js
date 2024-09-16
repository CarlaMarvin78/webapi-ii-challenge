const express = require('express');
const router = express.Router ();
const db = require ('./data/db');

router.post ('/', (req, res) =>{
    const query = req.query;
    if (query.title == undefined || query.contents == undefined){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."});
        } else {
            db.insert ({title:query.title, contents:query.contents})
            .then (id => {
                db.findById (id.id)
                .then (post => res.status(201).json(post));
            })
            .catch (err => res.status(500).json({error:"There was an error while saving the post to the database."}));
        }

});
function validatePostId (req, res, next){
  db.findById (req.params.id) 
  .then (post => {
      if (post.length > 0){
          next ();
      } else {
          res.status(404).json({message: "The post with the specified id does not exist."});
      }
  }) 
}
router.post ('/:id/comments', validatePostId, (req, res, next) =>{
    if (req.query.text == undefined){
        res.status(400).json({errorMessage: "Please provide text for the comment."});
    } else {
        db.insertComment ({text:req.query.text, post_id:req.params.id})
        .then (id => {
            db.findCommentById (id.id)
            .then (comment => res.status(201).json(comment));
        })
        .catch (err => res.status(500).json({error: "There was an error while saving the comment to the database."}))
    } 
})

router.get ('/', (req, res) =>{
    db.find ()
    .then (posts => res.status(200).json(posts))
    .catch (err => res.status(500).json({error: "The posts information could not be retrieved."}));
})

router.get ('/:id', (req, res) =>{
    db.findById (req.params.id)
        .then (posts => {
            if (posts.length == 0){
                res.status(404).json({message: "The post with the specified id does not exist."});
            }else {
                 res.status(200).json(posts);
        }})
        .catch (err => res.status(500).json({error: "The post information could not be retrieved."}));
  })

  router.get ('/:id/comments', (req, res) => {
      db.findPostComments (req.params.id)
      .then (comments => {
        console.log ('comments', comments);
        if (comments.length == 0){
            res.status (404).json({message: "The post with the specified id does not exist."});
        } else {
            res.status(200).json(comments);
        }
      })
      .catch (err => res.status(500).json ({error: "The comments information could not be retrieved."}));
  }) 


  router.delete ('/:id', (req, res) => {
      db.remove (req.params.id)
      .then (num => {
          if (num  < 1){
            res.status(404).json({message: "The post with the specified id does not exist."});
          } else {
              res.sendStatus (200);
          }
        })  
        .catch(err => res.status(500).json ({error: "The post could not be removed."}));
      
  });
router.put('/:id', validatePostId, (req, res, next) =>{
    const query = req.query; 
    if (query.title==undefined || query.contents==undefined){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."});
    } else {
        db.update (req.params.id, {title:query.title, contents:query.contents})
        .then (num => {
            if (num == 1) {
                db.findById (req.params.id)
                .then (post => res.status(200).json(post));
            } else {
                res.status(500).json({error: "The post information could not be modified."});
            }
        })
        .catch(err => res.status(500).json({error: "The post information could not be modified."}))
    }
})
module.exports = router