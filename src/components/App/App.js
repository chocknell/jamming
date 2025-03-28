// import libraries
import React, {useState, useCallback} from 'react';

// import relevant components
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

// import styling sheet
import styles from './App.module.css';

function App() {

  // define base states required for app
  const [searchResults, setSearchResults] = useState([
    {
      name: "track1",
      artist: "artist1",
      album: "album1",
      id: 1,
      uri: "123"
  },
  {
      name: "track2",
      artist: "artist2",
      album: "album2",
      id: 2,
      uri: "234"
  },
  {
      name: "track3",
      artist: "artist3",
      album: "album3",
      id: 3,
      uri: "345"
  }
  ]);

  const [playlistTitle, setPlaylistTitle] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // define app methods

  // add song to playlist tracks
  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((newTrack) => newTrack.id === track.id)) {
        return;
      }
      setPlaylistTracks((prev) => [track, ...prev]);
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
  const savePlaylist = useCallback(() => {
    const playlistUris = playlistTracks.map((track) => track.uri);
  })

  return (
    <div className={styles.App}>
      <header className={styles.title}>
        <h1>Jamming Spotify Web App</h1>
      </header>
      <SearchBar />
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
    </div>
  );
}

export default App;
