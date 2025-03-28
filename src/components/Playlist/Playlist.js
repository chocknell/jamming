import React, { useCallback } from 'react';

// import styling sheet
import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist(props) {

    const handleNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value);
        },
        [props.onNameChange]
    );


    return (
        <div className={styles.PlaylistContainer}>
            <div className={styles.NameGroup}>
                <input 
                    type="text"
                    aria-label="Playlist Title"
                    placeholder="Playlist Title"
                    onChange={handleNameChange}
                    className={styles.PlaylistName}
                    id="name"
                    name="name"
                />
                <label for="name" className={styles.NameLabel}>Playlist Title</label>
            </div>
            <Tracklist 
                tracks={props.playlistTracks}
                onRemove={props.onRemove}
                isRemoval={true}
                className={styles.Tracklist}
            />
            <button 
                className={styles.submitButton}
                onClick={props.onSave}
            >
                Add to Spotify!
            </button>
        </div>
    );
};

export default Playlist;