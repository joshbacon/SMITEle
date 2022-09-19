import './App.css';
import React, { useEffect, useState } from 'react';
import GodData from './GodData.json';

function App() {

  // state variables
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [numGuesses, setNumGuesses] = useState(1);
  const [lastGuess, setLastGuess] = useState({});
  // const [tableData, setTableData] = useCookies([]);
  const [filteredData, setFilteredData] = useState([]);

  // const [gameWon, setGameWon] = useCookies(false);
  const [gameWon, setGameWon] = useState(false);
  const [pickedGod, setPickedGod] = useState({});
  // const [advanced, setAdvanced] = useCookies(false);
  const [advanced, setAdvanced] = useState(false);

  // handle filtering when the user searchs
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setSearch(searchWord);
    const newFiltered = GodData.filter((value) => {
      return (value.name.toLowerCase().includes(searchWord.toLowerCase()) &&
              tableData.findIndex(g => g.gid === value.gid) === -1  &&
              value.gid !== lastGuess.gid ) ||
             (advanced && tableData.findIndex(g => g.gid === value.gid) === -1 && (
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

  // handle adding a guess to the tableData state array
  const addGuess = (gid) => {
    const guess = GodData.find(value => value.gid === gid);
    setNumGuesses(numGuesses+1);
    if (Object.entries(guess).length !== 0 ){
      setFilteredData([]);
      setSearch("");
      // setTableData(tableData, [guess, ...tableData], {path: "/"});
      if (Object.entries(lastGuess).length !== 0 ) setTableData([lastGuess, ...tableData]);
      setLastGuess(guess);
    }
    // if (guess === pickedGod) setGameWon(true, {path: "/"});
    if (guess === pickedGod) {
      // const name = pickedGod.name;

      // Axios({
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   url: 'http://192.168.2.16:80/smle_api/capture.php',
      //   data: {numGuesses, name}
      // });//.then((response) => { console.log(response) });
      
      setGameWon(true);
    }
  }

  const newGame = () => {
    const index = Math.floor(Math.random() * GodData.length);
    setPickedGod(GodData[index]);
    // setTableData([], {path: "/"});
    setTableData([]);
    setLastGuess({});
    setNumGuesses(1);
    setSearch("");
    // setGameWon(gameWon, false, {path: "/"});
    setAdvanced(false);
    setGameWon(false);
  }

  const toggleAdvanced = () => {
    // setAdvanced(advanced, !advanced, {path: "/"});
    setAdvanced(!advanced);
  }

  // set the god to be guessed
  useEffect(() => {
    const index = Math.floor(Math.random() * GodData.length);
    setPickedGod(GodData[index]);
  }, []) // empty array as second argument means this only runs on initial load

  // main page to be rendered
  return (
    <div className="App">
      <header className="App-header">
        <img 
          src={require('./assets/logo.png')}
          alt={"SMITE"}
          height={199}
          width={399}
        />
        <h1>
          Welcome to SMITEle!<br/>
          {gameWon ? 'You can guess the God!' : 'Can you guess the God?'}
        </h1> 
        {/* search bar is where the api call would go to replace local GodData*/}
        {/*<SearchBar placeholder="Type a Gods name..." data={GodData} func={addGuess}/>*/}
        { gameWon ?
        <div className="winCard">
          <img
            height={500}
            width={350}
            alt={""}
            src={require('./assets/cards/'+pickedGod.name.toLowerCase().replace(/\s/g, "")+'.png')}
          />
          <div className="replay" onClick={newGame}>Play Again</div>
        </div> :
        <div className='search'>
          <div className='searchRow'>
            <div className='searchInputs'>
              <input type='text' placeholder={"Type a Gods name..."} value={search} onChange={handleFilter}/>
            </div>
            <div className='toolTip'>
              { numGuesses > 5 ?
                <img
                  className={"advanced-active"}
                  height={69}
                  width={80}
                  alt={""}
                  src={require('./assets/advanced.png')}
                  onClick={toggleAdvanced}
                /> :
                <img
                  height={69}
                  width={80}
                  alt={""}
                  src={require('./assets/disadvanced.png')}
                /> 
              }
              { advanced ? 
                <div className="plus">
                  <img
                    height={30}
                    width={30}
                    alt={""}
                    src={require('./assets/plus.png')}
                    onClick={toggleAdvanced}
                  />
                </div> :
                <div className="plus"/>
              }
              <div className='toolTipText'>
                <div className='toolTipTitle'>
                  Advanced Search
                </div>
                <div className='toolTipSmall'>
                  { numGuesses < 6 ?
                    'available in ' + (6 - numGuesses) + ' guess' + (numGuesses !== 5 ? 'es' : '') :
                    'search by pantheon, class or any other category!'
                  }
                </div>
              </div>
            </div>
          </div>
          { filteredData.length !== 0 && (
            <div className='dataResult'>
              {filteredData.map((value, key) => {
                return <div key={key} className='godSelector' onClick={() => addGuess(value.gid)}>
                  <img
                    height={95}
                    width={405}
                    alt={""}
                    src={require('./assets/icons/'+value.name.toLowerCase().replace(/\s/g, "")+'.png')}
                  />
                  <div className='godText'> {value.name} </div>
                </div>;
              })}
            </div>
          )}
        </div>}
      </header>
      <div className="Guesses-Table">
        <div className="Table-Titles">
          <div className="Data-Title">God</div>
          <div className="Data-Title">Gender</div>
          <div className="Data-Title">Pantheon</div>
          <div className="Data-Title">Class</div>
          <div className="Data-Title">Type</div>
          <div className="Data-Title">Release Date</div>
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
