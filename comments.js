// Create web server

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { Comment } = require('../models');

// Create router
const router = express.Router();

// Use body parser
router.use(bodyParser.json());

// Get all comments
router.get('/', (req, res) => {
  Comment.findAll()
    .then((comments) => {
      res.json(comments);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Create new comment
router.post('/', (req, res) => {
  const requiredFields = ['text', 'author', 'post_id'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField,
    });
  }

  const stringFields = ['text', 'author', 'post_id'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string',
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField,
    });
  }

  const trimmedFields = ['text', 'author', 'post_id'];
  const nonTrimmedField = trimmedFields.find(
    field => req.body[field].trim() !== req.body[field],
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  const sizedFields = {
    text: {
      min: 1,
    },