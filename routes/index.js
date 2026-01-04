import express from "express";
import { getUsers, Register, Login } from "../controllers/Users.js";
import { getBooksPublic, postBooks, getBooks } from "../controllers/Books.js";
import { getLogs, postLogs, getLogsMe } from "../controllers/Logs.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// ROUTES Users
router.get('/users', getUsers);
router.post('/Register', Register);
router.post('/Login', Login);

//  ROUTES Books
router.get('/', getBooksPublic);
router.get("/books", verifyToken ,getBooks)
router.post('/books', verifyToken ,postBooks);

//  ROUTES Logs
router.get('/logs', getLogs);
router.get('/logs/me', verifyToken, getLogsMe)
router.post('/logs/pinjam', verifyToken ,postLogs);

export default router;