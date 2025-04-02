import React, { useState } from 'react';
import Track from '../Track/Track';


// import styling sheet
import styles from './Tracklist.module.css';

function Tracklist(props) {

    return (
        <div className={styles.list}>
            {props.tracks.map((track, i) => {
                return (
                    <Track 
                        track={track}
                        key={track.id}
                        onAdd={props.onAdd}
                        onRemove={props.onRemove}
                        isRemoval={props.isRemoval}
                    /> )
            })}
        </div>
    );
};

export default Tracklist;