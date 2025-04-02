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
                <label htmlFor="name" className={styles.NameLabel}>Playlist Title</label>
            </div>
            <div className={styles.tracklist}>
                <Tracklist 
                    tracks={props.playlistTracks}
                    onRemove={props.onRemove}
                    isRemoval={true}
                />
            </div>
        </div>
    );
};

export default Playlist;