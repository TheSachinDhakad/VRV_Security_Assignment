// const OnlyAdminCanAccess = async(req, res, next) => {

//     try {

//         if (req.user.role != 1) { // Not Equal to admin (Access only when the user role is 1)

//             return res.status(400).json({
//                 success: false,
//                 msg: 'Access denied. Only Admin have permission for this operation.'
//             });

//         }


//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: 'Oops! Something went wrong. Please try again later.'
//         });
//     }

//     return next();

// };

// module.exports = {
//     OnlyAdminCanAccess
// }



const User = require('../models/userModel'); // Adjust based on your actual path
const Role = require('../models/roleModel'); // Adjust based on your actual path

const OnlyAdminCanAccess = async (req, res, next) => {
    try {
        // Assuming user is attached to the req object after authentication (JWT or session-based auth)
        const user = await User.findById(req.user._id).populate('role');  // Populate the role from the Role collection

        if (!user || user.role.value !== 1) {  // If the user is not an Admin (value 1)
            return res.status(403).json({
                success: false,
                msg: 'Access denied. Only Admin has permission for this operation.'
            });
        }

        // Proceed to the next middleware or route handler if the user is an Admin
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Oops! Something went wrong. Please try again later.',
        });
    }
};

module.exports = { OnlyAdminCanAccess };
