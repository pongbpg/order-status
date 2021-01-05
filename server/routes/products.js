const router = require('express').Router();

var controllers = require('../controllers/products');

router.get('/', controllers.get)
router.post('/', controllers.create)
router.put('/', controllers.update)


module.exports = router;