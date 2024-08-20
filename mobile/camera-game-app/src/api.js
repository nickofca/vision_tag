const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


// Upload image to the server
export const uploadImage = (websocket, imageSrc, token) => {
  // Construct the action data as a JSON object
  const actionData = {
    image: imageSrc,
  };

  // Construct the message to be sent
  const message = JSON.stringify({
    token: token,
    type: "SubmittedShot",
    payload: JSON.stringify(actionData), // Convert actionData to JSON string
  });

  // Send the message over the WebSocket
  websocket.send(message);
};


// Sign up a new user
export const signupUser = (username, email, password) => {
  return fetch(`${API_BASE_URL}/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    }),
  }).then(response => response.json());
};

// Log in a user and retrieve session token
export const loginUser = (username, password) => {
  return fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.payload.token) {
      // Store the token in memory or local storage
      localStorage.setItem('sessionToken', data.payload.token);
    }
    return data.payload.token;
  });
};

// Log out the current user
export const logoutUser = (token) => {
  return fetch(`${API_BASE_URL}/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(response => response.json());
};

// Create a new game using WebSocket
export const initiateWebSocket = (web_socket_url) => {
  const ws = new WebSocket(web_socket_url);

  // Connection opened
  ws.addEventListener("open", event => {
    ws.send("Connection established")
  });

  // Listen for messages
  ws.addEventListener("message", event => {
    console.log("Message from server ", event.data)
  });

  // Convert ws.onclose to addEventListener
  ws.addEventListener("close", () => {
    console.log('WebSocket closed');
  });

  // Convert ws.onerror to addEventListener
  ws.addEventListener("error", (error) => {
    console.error('WebSocket error:', error);
  });

  return ws;
};

// Join an existing game using WebSocket
export const joinGame = (gameId, token) => {
  return initiateWebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/join_game/${gameId}?token=${token}`);
};

// Create new game using WebSocket
export const createGame = (token) => {
  return initiateWebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/create_game/?token=${token}`);
};
