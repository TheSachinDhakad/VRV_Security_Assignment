const Comment = require('../models/commentModel'); // Assuming your Comment model is in 'models/Comment'

// Create a new comment
const createComment = async (req, res) => {
    try {
        const { user_id, post_id, comment } = req.body;

        // Create new comment
        const newComment = new Comment({ user_id, post_id, comment });

        // Save the comment to the database
        await newComment.save();

        res.status(201).json({ message: 'Comment created successfully', newComment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create comment', message: err.message });
    }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
    try {
        const { post_id } = req.params;

        // Fetch all comments for the given post
        const comments = await Comment.find({ post_id }).populate('user_id', 'name email'); // Optionally populate user details

        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' });
        }

        res.status(200).json({ comments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get comments', message: err.message });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { comment } = req.body;

        // Find and update the comment
        const updatedComment = await Comment.findByIdAndUpdate(comment_id, { comment }, { new: true });

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment updated successfully', updatedComment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update comment', message: err.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;

        // Find and delete the comment
        const deletedComment = await Comment.findByIdAndDelete(comment_id);

        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete comment', message: err.message });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};
