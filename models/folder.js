'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true}
});

folderSchema.set('timestamps', true);

folderSchema.set('toObject', {
	virtuals: true, // initializing each folder w/ id
	versionKey: false, // no __v
	transform: (doc, ret) => {
		delete ret._id;
	}
});

module.exports = mongoose.model('Folder', folderSchema);