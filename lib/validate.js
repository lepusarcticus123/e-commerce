/**
 * regex statement
 */
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 验证邮箱，返回响应
 *
 * @export
 * @param {*} email
 * @returns {*} response
 */
export function validateEmail(email) {
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ message: "Invalid email address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ message: "Email is valid" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * 验证密码，返回响应
 *
 * @export
 * @param {*} password
 * @returns {*} response
 */
export function validatePassword(password) {
  if (!passwordRegex.test(password)) {
    return new Response(
      JSON.stringify({
        message:
          "Password must be 8-20 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify({ message: "Password is valid" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
