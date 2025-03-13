import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default async function authenticate(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '') || res.cookie('token');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    };
