import Users_M from "../Models/options/Options-Users.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

// פונקציה להצפנת הסיסמה
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

class UsersControll {
  async Allusers(req, res) {
    try {
      const usersFdb = await Users_M.getUsers();
      res.json({ usersFdb });
    } catch (error) {
      console.log(error.message);
    }
  }

  ///
  /// הרשמה
  ///
  
  async sign_up(req, res) {
    try {
      // בדיקה אם האימייל כבר קיים במערכת
      const existingUser = await Users_M.fineByEmail(req.body.email);
      if (existingUser) {
        console.log("Email already exists");
        return res.status(409).json({ error: "Email already exists" });
      }
      // הצפנת הסיסמה
      const hashedPassword = await hashPassword(req.body.password);
      // שמירת המשתמש עם הסיסמה המוצפנת
      await Users_M.save({ ...req.body, password: hashedPassword });
      res.json({ "add user": req.body });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  ///
  /// התחברות
  ///

  async log_in(req, res) {
    try {
      const { password, email } = req.body;

      // בודקים אם הסיסמה או האימייל התקבלו
      if (!password || !email) {
        return res
          .status(400)
          .json({ error: "Password and email are required!" });
      }

      // מוצאים את כל המשתמשים מהבסיס נתונים
      const allUsers = await Users_M.getUsers();

      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({
          error:
            "No users found in the database with the provided credentials.",
        });
      }

      // בודקים אם יש משתמש עם האימייל והסיסמה שהתקבלו בבקשה
      const user = allUsers.find(
        (user) =>
          user.email === email && bcrypt.compareSync(password, user.password)
      );
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // אם הסיסמה נכונה, יוצרים טוקן JWT
      const payload = { userId: user.id, userEmail: user.email };
      const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "10m",
      });

      // הוספת פרטי המשתמש לתגובה
      const userDetails = {
        id: user.id,
        name: user.FirstName,
        email: user.email,
      };

      res.status(200)
        .json({ success: "Login successful", token, user: userDetails });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  ///
  ///בדיקת המשתמשים
  ///

  async CheckAuth(req, res) {
    try {
      const token = req.authToken;

      if (!token) {
        return res
          .status(401)
          .json({ isAuthenticated: false, message: "No token found" });
      }

      // פענוח הטוקן
      const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      console.log(decoded);
      // בדיקה אם המשתמש קיים במסד הנתונים
      const user = await Users_M.fineByEmail(decoded.userEmail);

      if (!user) {
        return res
          .status(401)
          .json({ isAuthenticated: false, message: "User not found" });
      }

      // החזרת מידע על המשתמש המאומת
      res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          name: user.FirstName,
          email: user.email,
          // הוסף כאן שדות נוספים לפי הצורך
        },
      });
    } catch (error) {
      console.error("Error in checkAuth:", error);

      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ isAuthenticated: false, message: "Invalid token" });
      }

      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ isAuthenticated: false, message: "Token expired" });
      }

      res.status(500).json({ isAuthenticated: false, message: "Server error" });
    }
  }
}

export default new UsersControll();
