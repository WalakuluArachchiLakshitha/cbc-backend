import express from 'express';
const router = express.Router();

// Example route: GET /students/
router.get('/', (req, res) => {
    res.json({ message: 'Students route is working!' });
});

export default router;
