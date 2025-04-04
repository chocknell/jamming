import React from 'react';
import Tracklist from '../Tracklist/Tracklist';

// import styling sheet
import styles from './SearchResults.module.css';

function SearchResults(props) {

    return (
        <div className={styles.searchResults}>
            <h2>Search Results</h2>
            <div className={styles.tracklist}>
                <Tracklist 
                    tracks={props.searchResults} 
                    onAdd={props.onAdd} 
                />
            </div>
        </div>
    );
};

export default SearchResults;