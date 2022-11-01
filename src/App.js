import './App.css';
import React, { useEffect, useState } from 'react';
import GodData from './GodData.json';

function App() {

  // state variables
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [numGuesses, setNumGuesses] = useState(0);
  const [lastGuess, setLastGuess] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const [gameWon, setGameWon] = useState(false);
  const [pickedGod, setPickedGod] = useState({});
  const [advanced, setAdvanced] = useState(false);

  // Handle filtering when the user searchs
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setSearch(searchWord);
    const newFiltered = GodData.filter((value) => {
      return (value.name.toLowerCase().includes(searchWord.toLowerCase()) &&
              tableData.findIndex(g => g.gid === value.gid) === -1 &&
              value.gid !== lastGuess.gid ) ||
             (advanced && tableData.findIndex(g => g.gid === value.gid) === -1 &&
              value.gid !== lastGuess.gid && (
              value.name.toLowerCase().includes(searchWord.toLowerCase()) ||
              value.gender.toLowerCase().includes(searchWord.toLowerCase()) ||
              value.pantheon.toLowerCase().includes(searchWord.toLowerCase()) ||
              value.class.toLowerCase().includes(searchWord.toLowerCase()) ||
              value.type.toLowerCase().includes(searchWord.toLowerCase()) ||
              value.releaseDate.toString().includes(searchWord.toLowerCase())
             ));
    });
    if (searchWord === ""){
      setFilteredData([]);
    } else {
      setFilteredData(newFiltered);
    }
  }

  // Handle adding a guess to the tableData state array
  const addGuess = (gid) => {
    const guess = GodData.find(value => value.gid === gid);
    localStorage.setItem('numGuesses', (numGuesses+1).toString());
    setNumGuesses(numGuesses+1);
    if (Object.entries(guess).length !== 0 ){
      setFilteredData([]);
      setSearch("");
      if (Object.entries(lastGuess).length !== 0 ) {
        localStorage.setItem('tableData', JSON.stringify([lastGuess, ...tableData]))
        setTableData([lastGuess, ...tableData]);
      }
      setLastGuess(guess);
      localStorage.setItem('lastGuess', JSON.stringify(guess));
    }
    if (gid === pickedGod.gid) {
      console.log(gid === pickedGod.gid);
      setGameWon(true);
      localStorage.clear();
    }
  }

  // Reset values for a new game
  const newGame = () => {
    const index = Math.floor(Math.random() * GodData.length);
    setPickedGod(GodData[index]);
    localStorage.setItem('pickedGod', JSON.stringify(GodData[index]));
    setTableData([]);
    setLastGuess({});
    setNumGuesses(0);
    setSearch("");
    setAdvanced(false);
    setGameWon(false);

    // LocalStorage is cleared on correct guess, so unecessary here
    //localStorage.clear();
  }

  const toggleAdvanced = () => {
    setAdvanced(!advanced);
    localStorage.setItem('advanced', (!advanced).toString());
  }

  // Setup variables on-load
  useEffect(() => {

    let LSpicked = localStorage.getItem('pickedGod');
    let LStableData = localStorage.getItem('tableData');
    let LSlastGuess = localStorage.getItem('lastGuess');
    let LSnumGuesses = localStorage.getItem('numGuesses');
    let LSadvanced = localStorage.getItem('advanced');

    if (LSpicked) {
      setPickedGod(JSON.parse(LSpicked));
    } else {
      // Pick new god to be guessed
      const index = Math.floor(Math.random() * GodData.length);
      setPickedGod(GodData[index]);
      localStorage.setItem('pickedGod', JSON.stringify(GodData[index]));
    }
    // Other state variables are initialized to empty state, so no else
    if (LStableData) {
      setTableData(JSON.parse(LStableData));
    }
    if (LSlastGuess) {
      setLastGuess(JSON.parse(LSlastGuess));
    }
    if (LSnumGuesses) {
      setNumGuesses(parseInt(LSnumGuesses, 10));
    }
    if (LSadvanced) {
      setAdvanced(LSadvanced === 'true' ? true : false);
    }

    // could fix properly but it doesn't really matter for this project
    //eslint-disable-next-line
  }, []) // empty array as second argument means this only runs on initial load

  // Main page to be rendered
  return (
    <div className="App">
      <header>
        <div className="logo">
          <img
            src={require('./assets/logo.png')}
            alt={"SMITE"}
          />
        </div>
        <div className="title">
          <h1>
            Welcome to SMITEle!<br/>
            {gameWon ? 'You can guess the God!' : 'Can you guess the God?'}
          </h1>
        </div>
        <h2> {gameWon ? '...in '+numGuesses+' guesses.' : ''} </h2>
      </header>
      { gameWon ?
        <div className="win-state">
          <img
            alt={pickedGod.name}
            src={require('./assets/cards/'+pickedGod.name.toLowerCase().replace(/\s/g, "")+'.png')}
          />
          <div className="replay" onClick={newGame}>Play Again</div>
        </div> :
        <><div className='search-bar'>
          <input
            className='search-input'
            type='text'
            placeholder={"Type a Gods name..."}
            value={search}
            onChange={handleFilter} />
          <div className="tool-tip">
            <div className="as-button">
              {numGuesses >= 5 ?
                <img
                  className={"advanced-icon active"}
                  alt={"advanced search: enabled"}
                  src={require('./assets/advanced.png')}
                  onClick={toggleAdvanced} /> :
                <img
                  className={"advanced-icon"}
                  alt={"advanced search: disabled"}
                  src={require('./assets/disadvanced.png')} />}
              <div className="">
                {advanced ?
                  <img
                    className="as-indicator"
                    alt={"active"}
                    src={require('./assets/plus.png')}
                    onClick={toggleAdvanced} /> :
                  <div />}
              </div>
            </div>
            <div className='tip-text'>
              <div className='tip-title'>
                Advanced Search
              </div>
              <div className='tip-info'>
                {numGuesses < 5 ?
                  'available in ' + (5 - numGuesses) + ' guess' + (numGuesses !== 5 ? 'es' : '') :
                  'search by pantheon, class or any other category!'}
              </div>
            </div>
          </div>
          {filteredData.length !== 0 && (
            <div className='search-results'>
              {filteredData.map((value, key) => {
                return <div key={key} className='god-selector' onClick={() => addGuess(value.gid)}>
                  <img
                    alt={""}
                    src={require('./assets/icons/' + value.name.toLowerCase().replace(/\s/g, "") + '.png')} />
                  <div className='god-text'> {value.name} </div>
                </div>;
              })}
            </div>
          )}
        </div>
        <div className="container">
          <div className="scroll-box">
            <div className="table-titles">
              <div className="field-title">God</div>
              <div className="field-title">Gender</div>
              <div className="field-title">Pantheon</div>
              <div className="field-title">Class</div>
              <div className="field-title">Type</div>
              <div className="field-title">Release Date</div>
            </div>
            <div className="guesses-table">
              {Object.entries(lastGuess).length !== 0 && (
                <div key={lastGuess.gid} className='guess-item'>
                  <div
                    className={lastGuess.name === pickedGod.name ? "square correct a" : "square incorrect a"}>
                    {lastGuess.name}
                  </div>
                  <div
                    className={lastGuess.gender === pickedGod.gender ? "square correct b" : "square incorrect b"}>
                    {lastGuess.gender}
                  </div>
                  <div
                    className={lastGuess.pantheon === pickedGod.pantheon ? "square correct c" : "square incorrect c"}>
                    {lastGuess.pantheon}
                  </div>
                  <div
                    className={lastGuess.class === pickedGod.class ? "square correct d" : "square incorrect d"}>
                    {lastGuess.class}
                  </div>
                  <div
                    className={lastGuess.type === pickedGod.type ? "square correct e" : "square incorrect e"}>
                    {lastGuess.type}
                  </div>
                  <div
                    className={lastGuess.releaseDate === pickedGod.releaseDate ? "square correct f" :
                      lastGuess.releaseDate < pickedGod.releaseDate ? "square incorrect up f" : "square incorrect down f"}>
                    {lastGuess.releaseDate}
                  </div>
                </div>
              )}
              {tableData.length !== 0 && (
                <div className='guess-row'>
                  {[...tableData].map((value, key) => {
                    return <div key={key} className='guess-item'>
                      <div
                        className={value.name === pickedGod.name ? "square correct" : "square incorrect"}>
                        {value.name}
                      </div>
                      <div
                        className={value.gender === pickedGod.gender ? "square correct" : "square incorrect"}>
                        {value.gender}
                      </div>
                      <div
                        className={value.pantheon === pickedGod.pantheon ? "square correct" : "square incorrect"}>
                        {value.pantheon}
                      </div>
                      <div
                        className={value.class === pickedGod.class ? "square correct" : "square incorrect"}>
                        {value.class}
                      </div>
                      <div
                        className={value.type === pickedGod.type ? "square correct" : "square incorrect"}>
                        {value.type}
                      </div>
                      <div
                        className={value.releaseDate === pickedGod.releaseDate ? "square correct" :
                          value.releaseDate < pickedGod.releaseDate ? "square incorrect up" : "square incorrect down"}>
                        {value.releaseDate}
                      </div>
                    </div>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div></>
      }
    </div>
  );
}

export default App;
