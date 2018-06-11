'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Tag = require('../models/tag');
const Note = require('../models/note');

const router = express.Router();

// GET all tags
router.get('/', (req, res, next) => {
	// tags sorted by name
	Tag.find()
		.sort('name')
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		})
});

// GET a tag per a given id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// POST a new tag
router.post('/', (req, res, next) => {
	const { name } = req.body;
	if(!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const newTag = { name };

	Tag.create(newTag)
		.then(result => {
			res.location(`${req.originalUrl}/${result.id}`)
			.status(201)
			.json(result);
		})
		.catch(err => {
			if (err.code === 11000) {
				err = new Error('The tag name already exists');
				err.status = 400;
		  }
			next(err);
		});
});

// PUT a tag per given id
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateTag = { name, updatedAt: new Date() };

  Tag.findByIdAndUpdate(id, updateTag, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
	    err = new Error('The tag name already exists');
	    err.status = 400;
	  }
      next(err);
    });
});

// DELETE a tag per given id
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;