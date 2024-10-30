import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in." });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user ID from the token to the request object
        req.body.userId = decoded.id;
        
        // Move to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        }

        // Default to a generic error response
        res.status(500).json({ success: false, message: "An error occurred during authentication." });
    }
};

export default authMiddleware;
