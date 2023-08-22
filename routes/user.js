const router = require('express').Router({mergeParams: true})
const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/user')
const {protect, authorize} = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/')
.get(getUsers)
.post(createUser)

router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)


module.exports = router