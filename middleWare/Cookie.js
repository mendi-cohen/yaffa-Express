
// async function cookieConfig (req, res, next)  {
//     res.setCookie = (name, value, options = {}) => {
//       const defaultOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         maxAge: 60 * 60 * 1000
//       };
//       return res.cookie(name, value, { ...defaultOptions, ...options });
//     };
//     next();
//   }

//   export default cookieConfig;