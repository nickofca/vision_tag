const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch scoreboard data
export const fetchScore = () => {
  return fetch(`${API_BASE_URL}/scoreboard`)
    .then(response => response.json());
};

// Upload image to the server
export const uploadImage = (imageSrc, token) => {
  return fetch(`${API_BASE_URL}/score_shot`, {
    method: 'POST',
    body: JSON.stringify({ image: imageSrc }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Include token for authenticated requests
    },
  });
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
    if (data.token) {
      // Store the token in memory or local storage
      localStorage.setItem('sessionToken', data.token);
    }
    return data;
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
export const createGame = (token) => {
  const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/create_game/?token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket connected for game creation');
  };

  ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};

// Join an existing game using WebSocket
export const joinGame = (gameId, token) => {
  const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/join_game/${gameId}?token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket connected for joining game');
  };

  ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};