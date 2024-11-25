const User = require('../models/userModel');

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Permission = require('../models/permissionModel');

const UserPermission = require('../models/userPermissionModel');


const Role = require('../models/roleModel'); // Assuming the Role model is in the models folder

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { name, email, password, isAdmin } = req.body;

        const isExistUser = await User.findOne({ email });

        if (isExistUser) {
            return res.status(200).json({
                success: false,
                msg: 'This E-mail is Already Exist!'
            });
        }

        // Find the role, if it's an admin, assign the admin role
        let role;

        if (isAdmin) {
            // Get the admin role from the roles collection
            role = await Role.findOne({ role_name: 'Admin' });

            if (!role) {
                return res.status(400).json({
                    success: false,
                    msg: 'Admin role does not exist in the system!'
                });
            }
        } else {
            // Default role for normal users
            role = await Role.findOne({ role_name: 'User' });

            if (!role) {
                return res.status(400).json({
                    success: false,
                    msg: 'User role does not exist in the system!'
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role._id // Assign the role ID
        });

        const userData = await user.save();

        // Assigning the Default Permissions to created User
        const defaultPermissions = await Permission.find({ is_default: 1 });

        if (defaultPermissions.length > 0) {
            const PermissionArray = [];

            defaultPermissions.forEach(permission => {
                PermissionArray.push({
                    permission_name: permission.permission_name,
                    permission_value: [0, 1, 2, 3] // All permission levels
                });
            });

            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: PermissionArray
            });

            await userPermission.save();
        }

        return res.status(200).json({
            success: true,
            msg: 'User Registered Successfully!',
            data: userData
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};


// // Generating the JWT Access Token

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "24h" });
    return token;
}
// Login User API Method

const loginUser = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        const accessToken = await generateAccessToken({ user: userData });

        // Fetch User Data with all the assigned permissions

        const result = await User.aggregate([
            {
                $match: { email: userData.email }
            },
            {
                $lookup: {
                    from: "userpermissions",
                    localField: "_id",
                    foreignField: "user_id",
                    as: 'permissions'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    permissions: {
                        $cond: {
                            if: { $isArray: "$permissions" },
                            then: { $arrayElemAt: ["$permissions", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "permissions": {
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            msg: 'You have successfully logged in.',
            accessToken: accessToken,
            tokenType: 'Bearer Token',
            data: result[0]
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}

// Get User Profile Method API


const getProfile = async (req, res) => {

    try {

        const user_id = req.user._id;
        const userData = await User.findOne({ _id: user_id });

        return res.status(200).json({
            success: true,
            msg: 'Profile data retrieved successfully',
            data: userData,
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}

module.exports = {
    registerUser,
    loginUser,
    getProfile
}