export const APP_FETCH = async (url,method,body) => {
  const loginData = JSON.parse(localStorage.getItem("login_response"));
  const token = loginData.access;
  const appRes = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body
  });

  console.log({appRes})
  return appRes;
};
