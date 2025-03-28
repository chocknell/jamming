import React, {useState} from 'react';

// import styling sheet
import styles from './SearchBar.module.css';

function SearchBar() {

    const [text, setText] = useState("");

    function handleTextChange(e) {
        setText(e.target.value);
    };

    return (
        <div>
            <form className={styles.search}>
                <input 
                    type="text"
                    value={text}
                    aria-label="Search for a song..."
                    placeholder="Search for a song..."
                    onChange={handleTextChange}
                    className={styles.searchBar}
                />
                <button type="submit" className={styles.submitButton}>Search</button>
            </form>
            {text}
        </div>
    )

};

export default SearchBar;