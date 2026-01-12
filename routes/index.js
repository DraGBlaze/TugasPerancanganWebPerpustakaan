import express from "express";
import { getUsers, Register, Login, roleStaff, updateMe, updateAdmin ,deleteUser, Logout } from "../controllers/Users.js";
import { getBooksPublic, postBooks, getBooks, deleteBook, updateBook } from "../controllers/Books.js";
import { getLogs, postLogs, getLogsMe, confirmBorrow, returnBorrow, deleteLog} from "../controllers/Logs.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// ROUTES Users
router.get('/users', verifyToken,getUsers);
router.post('/Register', Register);
router.post('/Login', Login);
router.get('/token', refreshToken);
router.put('/users/update', verifyToken, getUsers);
router.patch('/admin/:id', verifyToken, roleStaff);
router.patch('/users/me', verifyToken, updateMe);
router.patch('/admin/users/:id', verifyToken, updateAdmin);
router.delete('/users/delete/:id', verifyToken, deleteUser);
router.delete('/Logout', Logout)

//  ROUTES Books
router.get('/', getBooksPublic);
router.get("/books", verifyToken ,getBooks);
router.post('/books', verifyToken ,postBooks);
router.patch("/books/update/:id", verifyToken, updateBook)
router.delete('/books/delete/:id', verifyToken, deleteBook);

//  ROUTES Logs
router.get('/logs', getLogs);
router.get('/logs/me', verifyToken, getLogsMe);
router.post('/logs/pinjam', verifyToken ,postLogs);
router.patch('/logs/:id/confirm', verifyToken, confirmBorrow);
router.patch('/logs/:id/return', verifyToken, returnBorrow);
router.delete('/logs/delete/:id', verifyToken, deleteLog);

export default router;