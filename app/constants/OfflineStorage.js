const StoreofflineLocalStorage = async (keyName, defaultValue = null) => {
  try {
    const value = window.localStorage.getItem(keyName);

    if (value) {
      let value_to_return = value;
      value_to_return = JSON.parse(value_to_return);

     
      return value_to_return;
    } else {
      let value_to_store = JSON.stringify(defaultValue);
      //encrypt this character

      // value_to_store = encryptWithAES(value_to_store)

      window.localStorage.setItem(keyName, value_to_store);
      return defaultValue;
    }
  } catch (e) {
    let value_to_store = JSON.stringify(defaultValue);
    //encrypt this character

    // value_to_store = encryptWithAES(value_to_store)
    // console.log("shit went south")
    window.localStorage.setItem(keyName, value_to_store);
    return defaultValue;
  }
};

const setOfflineLocalStorage = async (keyName, defaultValue = null) => {
  try {
    let value_to_store = defaultValue;

   

    value_to_store = JSON.stringify(value_to_store);

    window.localStorage.setItem(keyName, value_to_store);
  } catch (err) {
    console.log(err);
  }
};

const getOfflineData = async (key) => {
  try {
    const value = localStorage.getItem(key);

    if (localStorage.hasOwnProperty(key) === true) { 
      let value = localStorage.getItem(key);

      return value != null ? JSON.parse(value) : null;
    } else {
      // console.log(`No localstorage with key ${key}`);
      return value != null ? value : null;
    }
  } catch (e) {
    console.log("Error reading data");
    // error reading value
  }
};

const removeValueFromOffline = async (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    // remove error

    return null;
  }
};

// dd=StoreofflineLocalStorage("user",null)
// console.log(dd)

export {
  StoreofflineLocalStorage,
  setOfflineLocalStorage,
  removeValueFromOffline,
  getOfflineData,
};
