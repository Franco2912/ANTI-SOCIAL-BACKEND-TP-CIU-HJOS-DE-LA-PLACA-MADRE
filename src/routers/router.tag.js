const { Router } = require('express');
const {
    getAllTags
} = require('../controllers/tag.controller');
const router = Router();

router.get('/tags', getAllTags);

module.exports = router