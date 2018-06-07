'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folder');

const router = express.Router();

// GET all folders
router.get('/', (req, res, next) => {
	// folders sorted by name
	Folder.find()
		.sort({ name: 'desc' })
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		})
});

// GET a folder per a given id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findById(id)
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

// POST a new folder
router.post('/', (req, res, next) => {
	const { name } = req.body;
	if(!name) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}

	const newFolder = { name };

	Folder.create(newFolder)
		.then(result => {
			res.location(`${req.originalUrl}/${result.id}`)
			.status(201)
			.json(result);
		})
		.catch(err => {
			next(err);
		});
});

// PUT a folder per given id
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

  const updateFolder = { name, updatedAt: new Date() };

  Folder.findByIdAndUpdate(id, updateFolder, { new: true })
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

// DELETE a folder per given id
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;