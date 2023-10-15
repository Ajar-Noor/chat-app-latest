export const baseURL = "http://localhost:5000";

export const Postrequest = async (url, body) => {
  try {

    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      let message;
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }
      return { error: true, message };
    }
    return data;
  } catch (error) {
    console.error(error);
    return { error: "You are offline" };
  }
};

export const Getrequest = async (url, headers) => {
  try {
    const response = await fetch(url, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      let message;
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }
      return { error: true, message };
    }
    return data;
  } catch (error) {
    return { error: "You are offline" };
  }
};
