const validateUserDetails = async (userName, userEmail, password, role) => {
    return !(userEmail && userName && password && role);
}
export { validateUserDetails };