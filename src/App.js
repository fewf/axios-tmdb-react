import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';
import {Badge, Button, Card, Container, Image, ListGroup, Nav, Navbar, Row, Col} from 'react-bootstrap';
import moment from 'moment';

const PATHS = {
  index: '/',
  movieDetail: '/movie/:id'
};

const API_ROOT = 'https://api.themoviedb.org/3/discover/movie';
const API_KEY = '1821c6b6049945b0e08619035590d15b';

function getApiUrl(query) {
  query.api_key = API_KEY;
  const search = Object.keys(query).map(
    paramKey => `${encodeURIComponent(paramKey)}=${encodeURIComponent(query[paramKey])}`
  ).join('&');
  return `${API_ROOT}${search ? '?' : ''}${search}`;
}

function formatDate(date) {
  return moment(date).format('MMMM D, Y');
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: {},
      movies: null
    }
  }
  async componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = async () => {
    const response = await fetch(getApiUrl({primary_release_year: 2016}));
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
        <Container>
          <Navbar bg="light" variant='light' className="App-header">
            <Switch>
              <Route exact path={PATHS.index} component={IndexHeader} />
              <Route path={PATHS.movieDetail} render={({match: {params}}) => <DetailHeader movieTitle={movies.get(Number(params.id)).title} />} />
            </Switch>
          </Navbar>
          <Switch>
            <Route exact path={PATHS.index} render={props => <MovieList movies={movies} />} />
            <Route path={PATHS.movieDetail} render={({match: {params}}) => <MovieDetail movie={movies.get(Number(params.id))} isFavorite={favorites[params.id]} updateFavorites={this.updateFavorites} />} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

function IndexHeader() {
  return <Navbar.Brand>Movies</Navbar.Brand>;
}

function DetailHeader({movieTitle}) {
  return [
    // dummy span so that justify-content: space-between
    // will center title and right-align close button
    <span />,
    <Navbar.Brand>{movieTitle}</Navbar.Brand>,
    <Link to={PATHS.index}><Button>Close</Button></Link>
  ];
}

function MovieList({movies}) {
  return (
    <ListGroup>
      {
        [...movies].map(
          ([id, movie]) => (
            <ListGroup.Item key={id} className='list-group-item-movie'>
              <Container>
                <Row>
                  <h5>{movie.title}</h5>
                </Row>
                <Row className='list-group-item-movie-row-info'>
                  <Col>
                    <Image
                      src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                      fluid
                    />
                  </Col>
                  <Col>
                    <div>{formatDate(movie.release_date)}</div>
                    <Link to={`/movie/${movie.id}`}><Button>Detail</Button></Link>
                  </Col>
                  <Col>
                    <PopularityBadge popularity={Math.round(movie.popularity)} />
                  </Col>
                </Row>
              </Container>
            </ListGroup.Item>
          )
        )
      }
    </ListGroup>
  );
}

function MovieDetail({movie, isFavorite, updateFavorites}) {
  return (
    <Card className='movie-detail'>
      <Container>
        <Row>
          <Col>
            <Image
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              fluid
            />
          </Col>
          <Col>
            <Container>
              <Row noGutters className='row-movie-details-icons'>
                <Col>
                  <PopularityBadge popularity={Math.round(movie.popularity)} />
                </Col>
                <Col>
                  <button
                    className='button-favorite'
                    onClick={e => updateFavorites(movie.id)}>
                    {isFavorite ? '★' : '☆'}
                  </button>
                </Col>
              </Row>
              <Row>
                <h6>{formatDate(movie.release_date)}</h6>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          {movie.overview}
        </Row>
      </Container>
    </Card>
  );
}

function PopularityBadge(props) {
  return (
    <Badge pill variant='success' className='badge-popularity'>
      {props.popularity}%
    </Badge>
  );
}

export default App;
