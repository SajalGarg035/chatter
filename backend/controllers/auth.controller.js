import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        
        if (!email || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        
        const user = new User({
            email,
            name,
            password: hash,
        });
        const token = generateToken(user._id);
        
        await user.save();
        
        return res.status(201).json({ 
            message: "User created successfully",
            token 
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        
        if (!bcryptjs.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: 3600 }
        );
        
        res.cookie('token', token, { maxAge: 3600 * 1000 }); 
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout successful" });
}

export const profile = async (req, res) => {
    try {
        const { name, email, profilepic } = req.body;
        const
        user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilepic = profilepic || user.profilepic;
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully" });
    }
    catch(error){
        console.error("Error updating profile:", error);
    }
};
