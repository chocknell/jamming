// import libraries
import React, { useState, useCallback } from 'react';

// import relevant components
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

//import Spotify methodology
import { redirectToSpotifyAuthorize, createPlaylist, refreshToken, isTokenExpired, spotifySearch } from '../../utilities/Spotify';

// import styling sheet
import styles from './App.module.css';

function App() {

  // define base states required for app
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);


  // define app methods

  //spotify search
  
  const handleSubmit = async (error) => {
    error.preventDefault();

    if (!search) {
      return;
    }

    let accessToken = localStorage.getItem('access_token');
    console.log('AccessToken: ' + accessToken);

    if (!accessToken || isTokenExpired()) {
      console.log("Token missing or expired. Refreshing token...");
      accessToken = await refreshToken();
      console.log(accessToken);
      if (!accessToken) {
        alert(
          "Impossible to refresh token. Must re-authorize."
        );
        return;
      }
    }
    const tracks = await spotifySearch(search).then(results => setSearchResults(results));

  }

  // add song to playlist tracks
  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((newTrack) => newTrack.id === track.id)) {
        return;
      }
      setPlaylistTracks((prev) => [...prev, track]);
    },
    [playlistTracks]
  );

  //remove song from playlist tracks
  const removeTrack = useCallback(
    (track) => {
      setPlaylistTracks((playlistTracks) =>
        playlistTracks.filter((song) => song.id !== track.id)
      );
    }, []);

  //change playlist name
  const changePlaylistTitle = useCallback((name) => {
    setPlaylistTitle(name);
  }, []);

  // save playlist uris
  const savePlaylist = async () => {

    if (playlistTitle==="New Playlist" || playlistTitle==="") {
      alert('Please enter a valid name for your playlist');
      return;
    }
    const playlistUris = playlistTracks.map((track) => track.uri);

    if (playlistUris.length===0) {
      alert('Your playlist is empty! Add some tracks before saving it to Spotify.');
      return;
    }

    await createPlaylist(playlistTitle, playlistUris).then(() => {
      alert(`New Playlist ${playlistTitle} has been created!`);
      setPlaylistTitle('New Playlist');
      setPlaylistTracks([]);
    })
  }

  return (
    <div className={styles.App}>
      <header className={styles.title}>
        <h1>Spotify Playlist Creator</h1>
      </header>
      <SearchBar 
        search={search}
        setSearch={setSearch}
        handleSubmit={handleSubmit}
      />
      <div className={styles.resultsContainer}>
        <div className={styles.searchResults}>
          <SearchResults 
            searchResults={searchResults}
            onAdd={addTrack}
          />
        </div>
        <div className={styles.newPlaylist}>
          <Playlist 
            playlistTitle={playlistTitle}
            playlistTracks={playlistTracks}
            onNameChange={changePlaylistTitle}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </div>
      <div className={styles.footer}>
      <button 
        className={styles.submitButton}
        onClick={savePlaylist}
      >
        Add {playlistTitle} to Spotify!
      </button>
      </div>
    </div>
  );
}

export default App;
