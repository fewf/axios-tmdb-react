import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: {},
      movies: null,
      selectedMovie: null
    }
  }
  async componentDidMount() {
    const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=1821c6b6049945b0e08619035590d15b&year=2016');
    const {results} = await response.json();
    this.setState({
      movies: results
    });
  }
  render() {
    const {favorites, movies, selectedMovie} = this.state;
    if (!movies) return <div>Loading...</div>;

    return (
      <div className="App">
        <header className="App-header">
          {
            !selectedMovie
            ? <h1>Movies</h1>
            : <p>
                <h2>{selectedMovie.title}</h2>
                <button onClick={e => this.setState({selectedMovie: null})}>close</button>
              </p>
          }
        </header>
        <div>
          {
            !selectedMovie
            ? movies.map(
                movie => (
                  <div>
                    {movie.title}
                    {movie.release_date}
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                    />
                    {movie.popularity}
                    <button onClick={e => this.setState({selectedMovie: movie})}>Details</button>
                  </div>
                )
              )
            : <div>
                {selectedMovie.title}
                {selectedMovie.release_date}
                <img
                  src={`https://image.tmdb.org/t/p/w300/${selectedMovie.poster_path}`}
                />
                {selectedMovie.popularity}
                <button
                  onClick={e => this.setState({
                    favorites: {...favorites, [selectedMovie.id]: !favorites[selectedMovie.id]}
                  })}>
                  {favorites[selectedMovie.id] ? 'Unfave' : 'Fave'}
                </button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
