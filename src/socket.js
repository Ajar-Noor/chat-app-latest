import io from "socket.io-client"; // Add this

let socket;

const connectSocket = (user_id) => {
  socket = io("http://localhost:5000", {
    query: `user_id=${user_id}`,
  });
} 
console.log("socket io connection estalished")

export {socket, connectSocket};
