import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Navbar,
  OverlayTrigger,
  Row,
  Spinner
} from 'react-bootstrap';
import { PATHS } from './constants';
import { formatDate, getApiUrl } from './utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: {},
      movies: null
    };
  }
  async componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = async () => {
    const response = await fetch(getApiUrl({ primary_release_year: 2016 }));
    const { results } = await response.json();
    this.setState({
      movies: results.reduce(
        (movies, movie) => movies.set(movie.id, movie),
        new Map()
      )
    });
  };

  updateFavorites = movieId => {
    this.setState(({ favorites }) => ({
      favorites: { ...favorites, [movieId]: !favorites[movieId] }
    }));
  };

  render() {
    const { favorites, movies } = this.state;
    if (!movies) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }

    return (
      <Router>
        <Container>
          <Navbar bg="light" variant="light" className="App-header">
            <Switch>
              <Route exact path={PATHS.index} component={ListHeader} />
              <Route
                path={PATHS.movieDetail}
                render={({ match: { params } }) => (
                  <DetailHeader
                    movieTitle={movies.get(Number(params.id)).title}
                  />
                )}
              />
            </Switch>
          </Navbar>
          <Switch>
            <Route
              exact
              path={PATHS.index}
              render={props => <MovieList movies={movies} />}
            />
            <Route
              path={PATHS.movieDetail}
              render={({ match: { params } }) => (
                <MovieDetail
                  movie={movies.get(Number(params.id))}
                  isFavorite={favorites[params.id]}
                  updateFavorites={this.updateFavorites}
                />
              )}
            />
          </Switch>
        </Container>
      </Router>
    );
  }
}

function ListHeader() {
  // dummy span so that justify-content: space-between
  // will center Movies
  return <>
    <span />
    <Navbar.Brand>
      <h5>Movies</h5>
    </Navbar.Brand>
    <span />
  </>;
}

function DetailHeader({ movieTitle }) {
    // dummy span so that justify-content: space-between
    // will center title and right-align close button
  return <>
    <span />
    <Navbar.Brand>{movieTitle}</Navbar.Brand>
    <Link to={PATHS.index}>
      <Button>Close</Button>
    </Link>
  </>;
}

function MovieList({ movies }) {
  return (
    <ListGroup>
      {[...movies].map(([id, movie]) => (
        <ListGroup.Item key={id} className="list-group-item-movie">
          <Container>
            <Row>
              <h6>{movie.title}</h6>
            </Row>
            <Row className="list-group-item-movie-row-info">
              <Col>
                <Image
                  src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                  fluid
                />
              </Col>
              <Col>
                <div>{formatDate(movie.release_date)}</div>
                <Link to={`/movie/${movie.id}`}>
                  <Button>Detail</Button>
                </Link>
              </Col>
              <Col>
                <PopularityBadge popularity={Math.round(movie.popularity)} />
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function MovieDetail({ movie, isFavorite, updateFavorites }) {
  return (
    <Card className="movie-detail">
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
              <Row noGutters className="row-movie-details-icons">
                <Col>
                  <PopularityBadge popularity={Math.round(movie.popularity)} />
                </Col>
                <Col>
                  <OverlayTrigger
                    placement="right-start"
                    delay={{ show: 250, hide: 400 }}
                    overlay={props => (
                      <div className="overlay" {...props}>
                        {isFavorite
                          ? 'Remove from Favorites'
                          : 'Add to Favorites'}
                      </div>
                    )}
                  >
                    <button
                      className="button-favorite"
                      onClick={e => updateFavorites(movie.id)}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row>
                <h6>{formatDate(movie.release_date)}</h6>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>{movie.overview}</Row>
      </Container>
    </Card>
  );
}

function PopularityBadge(props) {
  return (
    <Badge pill variant="success" className="badge-popularity">
      {props.popularity}%
    </Badge>
  );
}

export default App;
