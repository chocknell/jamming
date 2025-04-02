import React, {useState, useCallback} from 'react';

// import styling sheet
import styles from './SearchBar.module.css';

function SearchBar(props) {

    //const [text, setText] = useState("");

    function handleTextChange(e) {
        props.setSearch(e.target.value);
    }

    /*
    const search = useCallback(() => {
        props.onSearch(props.search);
    }, [props.onSearch, props.search]);
    */

    return (
        <div>
            <form className={styles.search} onSubmit={props.handleSubmit}>
                <input 
                    type="text"
                    aria-label="Search for a song..."
                    placeholder="Search for a song..."
                    onChange={handleTextChange}
                    className={styles.searchBar}
                    value={props.search}
                />
                <button type="submit" className={styles.submitButton}>Search</button>
            </form>
        </div>
    )

};

export default SearchBar;