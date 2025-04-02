import React, { useCallback } from 'react';

// import styling sheet
import styles from './Track.module.css';

// define a track with the name, artist and album
function Track(props) {

    //add track button
    const addTrack = useCallback(
        (event) => {
            {props.onAdd(props.track)}
        },
        [props.onAdd, props.track]
    );

    // remove track button
    const removeTrack = useCallback(
        (event) => {
            {props.onRemove(props.track)}
        },
        [props.track, props.onRemove]
    );

    //render action button
    const renderButton = () => {
        if (props.isRemoval) {
            return (
                <button onClick={removeTrack} className={styles.buttonRemove}>
                     - 
                </button>
            )
        } else {
            return (
                <button onClick={addTrack} className={styles.buttonAdd}>
                     + 
                </button>
            )
        }
    }
    

    return (
        <div className={styles.TrackContainer}>
            <div className={styles.Tracks}>
                <h3>{props.track.name}</h3>
                <p>
                    {props.track.artist} || {props.track.album}
                </p>
            </div>
            <div className={styles.playlistButton}>
                {renderButton()}
            </div>
        </div>
    )
};

export default Track;