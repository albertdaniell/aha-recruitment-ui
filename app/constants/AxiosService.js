import { getCookie } from "./utils";

const axios = require("axios");


const AxiosGetService = async (url, Token = null) => {
  // is_open_url means that the api does not need authorization
  // Get token from the local storage

  
  // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY5NDQ2ODQyLCJpYXQiOjE2Njg4MzQ4NDIsImp0aSI6IjY3MjcyNzJjYjZjYzQwNTM4MzY4N2UyNWM1MTY0MWZhIiwidXNlcl9pZCI6Mn0.bgsi8uoY9j5q5AbRFfvu4ExF3R4B9Vmchufgeps64iM"

  let headers = {
    "Content-Type": "application/json",
  };

  if(Token !== null){
    headers = {
     "Content-Type": "application/json",
     "Authorization": `Token ${Token}`
   };
 }
//  console.log({headers})

  const promise = axios.get(url, {headers});
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};

const AxiosPostService2 = async (
  url,
  data,
  Token=null,
  // csrf = null
) => {

  // console.log(data, 'IN AXIOS');
  let csrf = getCookie('XSRF-TOKEN') 
  // is_open_url means that the api does not need authorization

  // console.log({csrf})

  let headers = {
    "Content-Type": "multipart/form-data",
  };

  if(Token){
     headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Token ${Token}`
    };
  }

  if(csrf){
    headers['X-CSRFToken'] = csrf
    headers['Content-Type'] = 'multipart/form-data'
  }


// console.log(headers)
// console.log(data)

  const promise = axios.post(url, data, {headers});
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};


const AxiosPutService2 = async (
  url,
  data,
  Token=null,
  // csrf = null
) => {

  // console.log(data, 'IN AXIOS');
  let csrf = getCookie('XSRF-TOKEN') 
  // is_open_url means that the api does not need authorization

  // console.log({csrf})

  let headers = {
    "Content-Type": "multipart/form-data",
  };

  if(Token){
     headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Token ${Token}`
    };
  }

  if(csrf){
    headers['X-CSRFToken'] = csrf
    headers['Content-Type'] = 'multipart/form-data'
  }


// console.log(headers)
// console.log(data)

  const promise = axios.put(url, data, {headers});
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};


const AxiosPostService = async (
  url,
  data,
  Token=null,
  auth_type = true,
  is_open_url = true,
) => {

  // is_open_url means that the api does not need authorization
  promise = null
  let headers = {
    "Content-Type": "application/json",
  };

  promise = axios.post(url, data);

  if (Token) {
    headers['Authorization'] = `Token ${Token}`;
     promise = axios.post(url, data, {headers});
  }

  // console.log({headers})

  

  
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};

const AxiosPutService = async (url, data) => {
  let headers = {
    "Content-Type": "application/json",
  };

  // console.log(data);
  const promise = axios.put(url, data, headers);
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};

const AxiosDeleteService = async (url) => {
  let headers = {
    "Content-Type": "application/json",
  };
  const promise = axios.delete(url, headers);
  const dataPromise = promise.then((response) => response);
  return dataPromise;
};

export {
  AxiosGetService,
  AxiosPostService,
  AxiosPutService,
  AxiosDeleteService,AxiosPostService2,AxiosPutService2
};
