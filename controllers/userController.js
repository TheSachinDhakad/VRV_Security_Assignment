const User = require('../models/userModel');

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const { sendMail } = require('../helpers/mailer');

const Role = require('../models/roleModel');
// Create New User API Method

const createNewUser = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array()
            });
        }

        const { name, email, role } = req.body;

        // Check if email already exists
        const isExists = await User.findOne({ email });
        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Sorry, this email is already registered!'
            });
        }

        // Fetch the default user role ObjectId if not provided
        const defaultRole = await Role.findOne({ value: 0 }); // assuming `0` is the role value for normal users

        // If role is provided, use it, otherwise use the default role
        const userRole = role || defaultRole._id;

        // Generate a random password and hash it
        const password = randomstring.generate(8);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user object
        const userObject = {
            name,
            email,
            password: hashedPassword,
            role: userRole
        };

        // Save the user
        const newUser = new User(userObject);
        const savedUser = await newUser.save();

        // Email content
        const content = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <p style="font-size: 18px;">Hello ${savedUser.name},</p>
                <p style="font-size: 16px;">Welcome to VRV Security.! Your registration was successful.</p>
                <p style="font-size: 16px;">Here are your login details:</p>
                <ul style="list-style: none; padding: 0; font-size: 16px;">
                    <li><strong>Email:</strong> ${savedUser.email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p style="font-size: 16px;">Keep this information secure. If you have questions, contact support@example.com.</p>
                <p style="font-size: 16px;">Thank you for choosing ByteWebster!</p>
            </div>
        `;

        // Send email
        await sendMail(savedUser.email, 'Registration Successful', content);

        // Response
        return res.status(200).json({
            success: true,
            msg: 'New user created successfully!',
            data: savedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Something went wrong',
            error: error.message
        });
    }
};
// Get All Users API Method

const getUsers = async (req, res) => {

    try {

        // console.log(req.user._id);

        const users = await User.find({
            _id: {
                $ne: req.user._id
            }
        });

        return res.status(200).json({
            success: true,
            msg: 'Users Data Fetched Successfully',
            data: users
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

// Update User Data API Method

const updateUser = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { id, name } = req.body;

        const isExists = await User.findOne({
            _id: id
        });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Sorry, This user does not exist!'
            });
        }

        var updateObj = {
            name
        }

        if (req.body.role != undefined) {
            updateObj.role = req.body.role;
        }

        const userUpdatedData = await User.findByIdAndUpdate({ _id: id }, {
            $set: updateObj
        }, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'User Data Updated Successfully!',
            data: userUpdatedData
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

// Delete User API Method

const deleteUser = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { id } = req.body;

        const isExists = await User.findOne({
            _id: id
        });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'User Not Found.',
            });
        }

        await User.findByIdAndDelete({
            _id: id
        });

        return res.status(200).json({
            success: true,
            msg: 'User Record Deleted Succcessfully!',
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

module.exports = {
    createNewUser,
    getUsers,
    updateUser,
    deleteUser
}