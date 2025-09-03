export const saveUserData = (email, data) => {
    localStorage.setItem(`user_${email}`, JSON.stringify(data));
  };
  
  export const getUserData = (email) => {
    const data = localStorage.getItem(`user_${email}`);
    return data ? JSON.parse(data) : null;
  };
  
  export const setCurrentUser = (email) => {
    localStorage.setItem('currentUser', email);
  };
  
  export const getCurrentUser = () => {
    return localStorage.getItem('currentUser');
  };
  
  export const logoutUser = () => {
    localStorage.removeItem('currentUser');
  };
  