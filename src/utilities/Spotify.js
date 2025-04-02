const clientId = "33dce9b5fcf5409f9932dd6bbab1791e";
const redirectUri = 'http://localhost:3000/';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = "user-read-private user-read-email playlist-modify-public playlist-modify-private";


// generate code verifier and enrypted code functions

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
};

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// function to redirect Spotify Authorization

export async function redirectToSpotifyAuthorize() {
    
    const code_verifier  = generateRandomString(64);
    const hashed = await sha256(code_verifier)
    const code_challenge_base64 = base64encode(hashed);
  
    window.localStorage.setItem('code_verifier', code_verifier);
  
    const authUrl = new URL(authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUri,
    };
  
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
};

// API Call Functions

export async function getToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');
  
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: code_verifier,
      }),
    });
  
    const data = await response.json();

    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        // store expiration time 
        const expirationTime = Date.now() + 3600 * 1000; // 1 heure
        localStorage.setItem("token_expiration", expirationTime);
        alert("Access token and refresh token stored.");
      } else {
        alert("Error in gathering the token information:" + data.access_token);
      };

};
  
export async function refreshToken() {

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
        alert("The refresh token is missing. Re-authorise the app.");
        return;
      };

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
    });
  
    try {
        const data = await response.json();
    
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          // add expiration time
          const expirationTime = Date.now() + 3600 * 1000; // 1 heure
          localStorage.setItem("token_expiration", expirationTime);
          console.log("Access token refresh successful. \n" + data.access_token);
          return data.access_token;
        } else {
          console.error("Error in gathering the token information:", data);
          if (data.error === 'invalid_grant') {
            console.log("The refresh token is missing. Re-authorise the app.");
            await redirectToSpotifyAuthorize();
          }
          return null;
        }
        } catch (error) {
            console.log("Error in refreshing the token:", error);
            return null;
        }
};

export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("token_expiration");
    return !expirationTime || Date.now() >= expirationTime;
  };

export async function spotifySearch(string) {

    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    if (code) {
        await getToken(code);
      
        // Remove code from URL so we can refresh correctly.
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
      
        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, updatedUrl);
    }

    let accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.warn("Token is missing or expired. Refreshing authentication...");
        accessToken = await refreshToken();
        if (!accessToken) {
          console.error("Not possible to access token.");
          return [];
        }
      }

    console.log(accessToken);

    const spotifyUrl = "https://api.spotify.com/v1/search?"
    const searchTerm = string.replaceAll(" ","+");
    const searchUrl = `q=${searchTerm}`;
    const searchParams = '&type=track&limit=5'
    const endpoint = `${spotifyUrl}${searchUrl}${searchParams}`;
    const authStatement = `Bearer ${accessToken}`;

    console.log(endpoint + '\n' + authStatement);
    
    const tracksFull = await fetch(endpoint, {
        headers: {
            'Authorization': authStatement
        }
    }).then(response => response.json())
    .then(data => { return data.tracks.items })

    const results = tracksFull.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
    }));

    return results;

}

export async function createPlaylist(title, playlistUris) {

    let accessToken = localStorage.getItem("access_token");
    console.log(playlistUris);
    
    //first, gather user information with GET request

    const userId = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        }
    })
    .then(response => response.json())
    .then(data => { return data.id });

    console.log(userId)

    //next, create new playlist

    const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`
    const playlistId = await fetch(playlistEndpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({name: title})
    })
    .then(response => response.json())
    .then(data => { return data.id });

    console.log(playlistId);

    //finally, add track uri's to the new playlist
    const addPlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    await fetch(addPlaylistEndpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({uris: playlistUris})
    });
    

} 

// redundant functions for later use

export const handleRedirect = async () => {

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
  
    if (code) {
      await getToken(code);
      window.history.replaceState({}, document.title, "/");
    }

};


// Click handlers
async function loginWithSpotifyClick() {
    await redirectToSpotifyAuthorize();
};
  
async function logoutClick() {
    localStorage.clear();
    window.location.href = redirectUri;
};
  
async function refreshTokenClick() {
    const token = await refreshToken();
    localStorage.setItem('access_token', token);
};