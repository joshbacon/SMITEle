import './App.css';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
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

  const [cookies, setCookie] = useCookies(['gameState']);

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
    setNumGuesses(numGuesses+1);
    setCookie('numGuesses', numGuesses, { path: '/' });
    if (Object.entries(guess).length !== 0 ){
      setFilteredData([]);
      setSearch("");
      if (Object.entries(lastGuess).length !== 0 ) {
        setTableData([lastGuess, ...tableData]);
        setCookie('tableData', tableData, { path: '/' });
      }
      setLastGuess(guess);
      setCookie('lastGuess', lastGuess, { path: '/' });
    }
    if (guess === pickedGod) {
      setGameWon(true);
      setCookie('gameWon', gameWon, { path: '/' });
    }
    console.log('HERE DOWN');
    console.log(cookies.pickedGod);
    console.log(cookies.tableData);
    console.log(cookies.lastGuess);
    console.log(cookies.numGuesses);
    console.log(cookies.advanced);
    console.log(cookies.gameWon);
  }

  // Reset values for a new game
  const newGame = () => {
    const index = Math.floor(Math.random() * GodData.length);
    setPickedGod(GodData[index]);
    setCookie('pickedGod', pickedGod, { path: '/' });
    setTableData([]);
    setCookie('tableData', [], { path: '/' });
    setLastGuess({});
    setCookie('lastGuess', {}, { path: '/' });
    setNumGuesses(0);
    setCookie('numGuesses', 0, { path: '/' });
    setSearch("");
    setAdvanced(false);
    setCookie('advanced', false, { path: '/' });
    setGameWon(false);
    setCookie('gameWon', false, { path: '/' });
  }

  const toggleAdvanced = () => {
    setAdvanced(!advanced);
    setCookie('advanced', advanced, { path: '/' });
  }

  // set the god to be guessed
  useEffect(() => {

    // Grab cookie data if available
    // if ( cookies.pickedGod.content !== undefined &&
    //      cookies.lastGuess.content !== undefined &&
    //      cookies.tableData.content !== undefined &&
    //      cookies.numGuesses.content !== undefined &&
    //      cookies.advanced.content !== undefined &&
    //      cookies.gameWon.content !== undefined){
    //   setPickedGod(cookies.pickedGod);
    //   setLastGuess(cookies.lastGuess);
    //   setTableData(cookies.tableData);
    //   setNumGuesses(cookies.numGuesses);
    //   setAdvanced(cookies.advanced);
    //   setGameWon(cookies.gameWon);
    // } else { // Else; set default values
      const index = Math.floor(Math.random() * GodData.length);
      setPickedGod(GodData[index]);
      setCookie('pickedGod', pickedGod, { path: '/' });
      setCookie('tableData', [], { path: '/' });
      setCookie('lastGuess', {}, { path: '/' });
      setCookie('numGuesses', 0, { path: '/' });
      setCookie('advanced', false, { path: '/' });
      setCookie('gameWon', false, { path: '/' });
      console.log('HERE DOWN');
      console.log(cookies.pickedGod);
      console.log(cookies.tableData);
      console.log(cookies.lastGuess);
      console.log(cookies.numGuesses);
      console.log(cookies.advanced);
      console.log(cookies.gameWon);
    // }
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
        <div className='search-bar'>
          <input
            className='search-input'
            type='text'
            placeholder={"Type a Gods name..."}
            value={search}
            onChange={handleFilter}
          />
          <div className="tool-tip">
            <div className="as-button">
              { numGuesses >= 5 ?
                <img
                  className={"advanced-icon active"}
                  alt={"advanced search: enabled"}
                  src={require('./assets/advanced.png')}
                  onClick={toggleAdvanced}
                /> :
                <img
                  className={"advanced-icon"}
                  alt={"advanced search: disabled"}
                  src={require('./assets/disadvanced.png')}
                /> 
              }
              <div className="">
                { advanced ?
                  <img
                    className="as-indicator"
                    alt={"active"}
                    src={require('./assets/plus.png')}
                    onClick={toggleAdvanced}
                  /> :
                  <div/>
                }
              </div>
            </div>
            <div className='tip-text'>
              <div className='tip-title'>
                Advanced Search
              </div>
              <div className='tip-info'>
                { numGuesses < 5 ?
                  'available in ' + (5 - numGuesses) + ' guess' + (numGuesses !== 5 ? 'es' : '') :
                  'search by pantheon, class or any other category!'
                }
              </div>
            </div>
          </div>
          { filteredData.length !== 0 && (
            <div className='dataResult'>
              {filteredData.map((value, key) => {
                return <div key={key} className='godSelector' onClick={() => addGuess(value.gid)}>
                  <img
                    alt={""}
                    src={require('./assets/icons/'+value.name.toLowerCase().replace(/\s/g, "")+'.png')}
                  />
                  <div className='godText'> {value.name} </div>
                </div>;
              })}
            </div>
          )}
        </div>
      }
      <div className="Guesses-Table">
        <div className="Table-Titles">
          <div className="Data-Title">God</div>
          <div className="Data-Title">Gender</div>
          <div className="Data-Title">Pantheon</div>
          <div className="Data-Title">Class</div>
          <div className="Data-Title">Type</div>
          <div className="Data-Title">Release<br/>Date</div>
        </div>
      </div>
      <div className="Guesses-Table">
        { Object.entries(lastGuess).length !== 0 && (
          <div key={lastGuess.gid} className='Guess-Items'>
            <div
              className={lastGuess.name === pickedGod.name ? "square-correct a" : "square-incorrect a"}>
              {lastGuess.name}
            </div>
            <div
              className={lastGuess.gender === pickedGod.gender ? "square-correct b" : "square-incorrect b"}>
              {lastGuess.gender}
            </div>
            <div
              className={lastGuess.pantheon === pickedGod.pantheon ? "square-correct c" : "square-incorrect c"}>
              {lastGuess.pantheon}
            </div>
            <div
              className={lastGuess.class === pickedGod.class ? "square-correct d" : "square-incorrect d"}>
              {lastGuess.class}
            </div>
            <div
              className={lastGuess.type === pickedGod.type ? "square-correct e" : "square-incorrect e"}>
              {lastGuess.type}
            </div>
            <div
              className={lastGuess.releaseDate === pickedGod.releaseDate ? "square-correct f" :
                lastGuess.releaseDate < pickedGod.releaseDate ? "square-incorrect up f" : "square-incorrect down f"}>
              {lastGuess.releaseDate}
            </div>
          </div>
        )}
        { tableData.length !== 0 && (
          <div className='Guess-Row'>
            {[...tableData].map((value, key) => {
              return <div>
                <div key={key} className='Guess-Items'>
                  <div
                    className={value.name === pickedGod.name ? "square-correct" : "square-incorrect"}>
                    {value.name}
                  </div>
                  <div
                    className={value.gender === pickedGod.gender ? "square-correct" : "square-incorrect"}>
                    {value.gender}
                  </div>
                  <div
                    className={value.pantheon === pickedGod.pantheon ? "square-correct" : "square-incorrect"}>
                    {value.pantheon}
                  </div>
                  <div
                    className={value.class === pickedGod.class ? "square-correct" : "square-incorrect"}>
                    {value.class}
                  </div>
                  <div
                    className={value.type === pickedGod.type ? "square-correct" : "square-incorrect"}>
                    {value.type}
                  </div>
                  <div
                    className={value.releaseDate === pickedGod.releaseDate ? "square-correct" :
                      value.releaseDate < pickedGod.releaseDate ? "square-incorrect up" : "square-incorrect down"}>
                    {value.releaseDate}
                  </div>
                </div>
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
