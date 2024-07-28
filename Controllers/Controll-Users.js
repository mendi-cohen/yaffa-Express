import Users_M from '../Models/options/Options-Users.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

// פונקציה להצפנת הסיסמה
async function hashPassword(password) {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

class UsersControll{
    
    async Allusers (req, res){
      try {
        const [usersFdb ,_] = await Users_M.getUsers() 
        res.json({usersFdb})

      } catch (error) {
        console.log(error.message);
      }
    }



    // הרשמה 
    

    async sign_in(req, res) {
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
          console.error('Error saving user:', error);
          res.status(500).json({ "error": "Internal Server Error" });
      }
  }


/// התחברות 

async loginUser(req, res) {
  try {
      const { password ,email} = req.body;
      // בודקים אם הסיסמה התקבלה
      if (!password || !email) {
          return res.status(400).json({ error: "Password is required!!!!" });
      }
      // מוצאים את כל המשתמשים מהבסיס נתונים
      const allUsers = await Users_M.getUsers();
      
      if (!allUsers || allUsers.length === 0) {
          return res.status(404).json({ error: "לא נמצאו משתמשים בבסיס הנתונים עם הסיסמה הנתונה" });
      }
      // בודקים אם יש משתמש שהסיסמה שווה לסיסמה שהתקבלה בבקשה
      const user = allUsers.find(user => user.email === email && bcrypt.compareSync(password, user.password));
      if (!user) {
          return res.status(401).json({ error: "סיסמה לא חוקית" });
      }
      // אם הסיסמה נכונה, יוצרים טוקן JWT ומחזירים אותו
      const payload = { userId: user.id, userEmail: user.email };
      const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: '10m' });

      // הוספת פרטי המשתמש לתגובה
      const userDetails = {id:user.id, name: user.userName, email: user.email }; 
      res.status(200).json({ success: "התחברות הצליחה", token, user: userDetails }); 

  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ "error": "שגיאה פנימית בשרת" });
  }
}


 




}





    



    
    
  
  
  
 
    export default new UsersControll();