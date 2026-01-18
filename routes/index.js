import express from "express";
import { getUsers, Register, Login, updateMe, updateAdmin ,deleteUser, Logout } from "../controllers/Users.js";
import { getBooksPublic, postBooks, getBooks, deleteBook, updateBook } from "../controllers/Books.js";
import { getLogs, postLogs, getLogsMe, confirmBorrow, returnBorrow, rejectBorrow, deleteLog} from "../controllers/Logs.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { isAdmin } from "../controllers/isAdmin.js";

const router = express.Router();

// ROUTES Users
router.get('/users', verifyToken,getUsers);
router.post('/Register', Register);
router.post('/Login', Login);
router.get('/token', refreshToken);
router.patch('/users/me', verifyToken, updateMe);
router.patch('/admin/users/:id', verifyToken, isAdmin , updateAdmin);
router.delete('/users/delete/:id', verifyToken, deleteUser);
router.delete('/Logout', Logout)

//  ROUTES Books
router.get('/', getBooksPublic);
router.get("/books", verifyToken ,getBooks);
router.post('/books', verifyToken ,postBooks);
router.patch("/books/update/:id", verifyToken, updateBook)
router.delete('/books/delete/:id', verifyToken, deleteBook);

//  ROUTES Logs
router.get('/logs', verifyToken ,getLogs);
router.get('/logs/me', verifyToken, getLogsMe);
router.post('/logs/pinjam', verifyToken ,postLogs);
router.patch('/logs/:id/confirm', verifyToken, confirmBorrow);
router.patch('/logs/:id/return', verifyToken, returnBorrow);
router.patch('/logs/:id/reject', verifyToken, rejectBorrow);
router.delete('/logs/delete/:id', verifyToken, isAdmin, deleteLog);

export default router;