import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';

const PATHS = {
  index: '/',
  movieDetail: '/movie/:id'
};

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
    const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=1821c6b6049945b0e08619035590d15b&primary_release_year=2016');
    const {results} = await response.json();
    this.setState({
      movies: results.reduce(
        (movies, movie) => movies.set(movie.id, movie),
        new Map()
      )
    });
  }

  updateFavorites = movieId => {
    this.setState(({favorites}) => ({
      favorites: {...favorites, [movieId]: !favorites[movieId]}
    }));
  }

  render() {
    const {favorites, movies} = this.state;
    if (!movies) return <div>Loading...</div>;

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Switch>
              <Route exact path={PATHS.index} component={IndexHeader} />
              <Route path={PATHS.movieDetail} render={({match: {params}}) => <DetailHeader movieTitle={movies.get(Number(params.id)).title} />} />
            </Switch>
          </header>
          <div>
            <Switch>
              <Route exact path={PATHS.index} render={props => <MovieList movies={movies} />} />
              <Route path={PATHS.movieDetail} render={({match: {params}}) => <MovieDetail movie={movies.get(Number(params.id))} isFavorite={favorites[params.id]} updateFavorites={this.updateFavorites} />} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

function IndexHeader() {
  return <h1>Movies</h1>;
}

function DetailHeader({movieTitle}) {
  return <p>
    <h2>{movieTitle}</h2>
    <Link to='/'>Close</Link>
  </p>;
}

function MovieList({movies}) {
  return [...movies].map(
    ([id, movie]) => (
      <div key={id}>
        {movie.title}
        {movie.release_date}
        <img
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        />
        {movie.popularity}
        <Link to={`/movie/${movie.id}`}>Detail</Link>
      </div>
    )
  );
}

function MovieDetail({movie, isFavorite, updateFavorites}) {
  return (
    <div>
      {movie.title}
      {movie.release_date}
      <img
        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
      />
      {movie.popularity}
      <button
        onClick={e => updateFavorites(movie.id)}>
        {isFavorite ? 'Unfave' : 'Fave'}
      </button>
    </div>
  );
}


export default App;
