import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

const Profile = (req, res) => {
    // console.log("req.cookies = ",req.cookies)
    const token = req.cookies.token;
    
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        const user = { id: decoded.id, username: decoded.email, roles: decoded.roles };
        res.json({ user });

    });
}

const Logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ message: 'Logout successful' });
}

export { Profile, Logout }