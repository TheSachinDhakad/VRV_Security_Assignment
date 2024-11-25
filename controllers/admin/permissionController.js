// const Permission = require('../../models/permissionModel');

// const { validationResult } = require('express-validator');


// // Add New Permissions API Method

// const addPermission = async (req, res) => {

//     try {

//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'Errors',
//                 errors: errors.array()
//             });
//         }

//         const { permission_name } = req.body;

//         const isExists = await Permission.findOne({
//             permission_name: {
//                 $regex: permission_name,
//                 $options: 'i'
//             }
//         });

//         if (isExists) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'This Permission is Already Exist!'
//             });
//         }

//         const obj = {
//             permission_name
//         };

//         if (req.body.default) {
//             obj.is_default = parseInt(req.body.default);
//         }

//         const permission = new Permission(obj);
//         const newPermission = await permission.save();

//         return res.status(200).json({
//             success: true,
//             msg: 'New Permission Created Successfully!',
//             data: newPermission
//         });
//     } 
//     catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message,
//         });
//     }
// };

// module.exports = {
//     addPermission
// };



const Permission = require('../../models/permissionModel');
const { validationResult } = require('express-validator');

const addPermission = async (req, res) => {
    try {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { permission_name } = req.body;

        // Check if permission already exists (case-insensitive search)
        const isExists = await Permission.findOne({
            permission_name: {
                $regex: permission_name,
                $options: 'i'
            }
        });

        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'This Permission already exists!'
            });
        }

        // Create new permission object
        const obj = { permission_name };

        if (req.body.default) {
            obj.is_default = parseInt(req.body.default);
        }

        // Save the new permission to the database
        const permission = new Permission(obj);
        const newPermission = await permission.save();

        return res.status(200).json({
            success: true,
            msg: 'New Permission Created Successfully!',
            data: newPermission
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
};

module.exports = {
    addPermission
};


// Get Permissions API Method

const getPermission = async (req, res) => {

    try {

        // For Fetching all the permissions from the database

        const permissions = await Permission.find({});

        return res.status(200).json({
            success: true,
            msg: 'Permissions Data successfully retrieved',
            data: permissions
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

// Delete Permissions API Method

const deletePermission = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        // Get ID from the Request

        const { id } = req.body;

        await Permission.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            msg: 'Permission Deleted successfully!',
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

// Update Permissions API Method

const updatePermission = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { id, permission_name } = req.body;

        const isExists = await Permission.findOne({ _id: id });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'The Permission ID you have entered does not exist in the system. Please verify the ID and try again.'
            });
        }

        const isNameAssigned = await Permission.findOne({
            _id: { $ne: id },
            permission_name: {
                $regax: permission_name,
                $option: 'i'
            }
        });

        if (isNameAssigned) {
            return res.status(400).json({
                success: false,
                msg: 'Permission name is already assigned. Please choose a different name.'
            });
        }

        var updatePermissionData = {
            permission_name
        }

        if (req.body.default != null) {
            updatePermissionData.is_default = parseInt(req.body.default);
        }

        const updatedPermission = await Permission.findByIdAndUpdate({ _id: id }, {
            $set: updatePermissionData
        }, { new: true });


        return res.status(200).json({
            success: true,
            msg: 'Permission updated successfully.',
            data: updatedPermission
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: 'Oops! Something went wrong. Please check the provided data and try again.',
        });
    }

}



const Role = require('../../models/roleModel');

// const { validationResult } = require('express-validator');
const User = require('../../models/userModel');  // Assuming you have a User model to find users
const UserPermission = require('../../models/userPermissionModel');  // Assuming you have a UserPermission model
// const Role = require('../../models/roleModel');  // Assuming Role model is in this path

const givePermissionToUser = async (req, res) => {
    try {
        // Permission Update Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array()
            });
        }

        // Check if the user is Admin
        const user = req.user;  // Assuming user info is attached to req.user (from authentication middleware)

        // Find the Admin role ObjectId
        const adminRole = await Role.findOne({ role_name: 'Admin' });
        if (!adminRole) {
            return res.status(500).json({
                success: false,
                msg: 'Admin role not found in the database.'
            });
        }

        // Check if the user's role matches the Admin ObjectId
        if (user.role.toString() !== adminRole._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: 'Access denied. Only Admin can assign permissions.'
            });
        }

        const { user_id, permissions } = req.body;

        // Validate if user_id is valid
        const targetUser = await User.findById(user_id);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                msg: 'User not found.'
            });
        }

        // Validate permissions format
        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'Permissions must be an array and cannot be empty.'
            });
        }

        // Check if permissions have valid structure
        for (const perm of permissions) {
            if (!perm.permission_name || !Array.isArray(perm.permission_value)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Each permission must have a valid name and permission values array.'
                });
            }

            // Validate permission values (should be numbers and within the range of [0, 3])
            for (const val of perm.permission_value) {
                if (![0, 1, 2, 3].includes(val)) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Permission values must be one of the following: [0 -> Create, 1 -> Read, 2 -> Edit, 3 -> Delete]'
                    });
                }
            }
        }

        // Check if the user already has a permission document
        let userPermission = await UserPermission.findOne({ user_id });

        // If the user does not have a permission document, create one
        if (!userPermission) {
            userPermission = new UserPermission({
                user_id,
                permissions
            });
        } else {
            // If the document exists, update it
            userPermission.permissions = permissions;
        }

        // Save the permissions to the database
        const updatedPermissions = await userPermission.save();

        return res.status(200).json({
            success: true,
            msg: 'Permissions assigned successfully.',
            data: updatedPermissions
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Something went wrong.',
            error: error.message
        });
    }
};










module.exports = {
    addPermission,
    getPermission,
    deletePermission,
    updatePermission,
    givePermissionToUser
}