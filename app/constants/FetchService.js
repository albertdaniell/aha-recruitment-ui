export const APP_FETCH = async (url,method,body,content_type="application/json") => {
  const loginData = JSON.parse(localStorage.getItem("login_response"));
  const token = loginData.access;
  const appRes = await fetch(url, {
    method,
    headers: {"Content-Type":content_type, Authorization: `Bearer ${token}` },
    body
  });

  console.log({appRes})
  return appRes;
};
