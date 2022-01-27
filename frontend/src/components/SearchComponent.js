import React from "react";

//Bootstrap components
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

//Custom CSS styling
import "./SearchComponent.css";

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);

    this.backEndGet = this.backEndGet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addToFavourites = this.addToFavourites.bind(this);
    this.removeFromFavourites = this.removeFromFavourites.bind(this);

    //Setting the states
    this.state = {
      error: null,
      favouriteListError: null,
      isLoaded: false,
      favouriteListIsLoaded: false,
      backEndItems: [],
      favouriteItems: [],
    };

    this.state = {
      searchValue: "",
    };
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  //GET request
  async backEndGet() {
    let select = document.getElementById("mediaSelect");
    let selectedOption = select.value;

    if (selectedOption !== "") {
      try {
        const fetchApi = await fetch(
          `/api/getMedia/${this.state.searchValue}/&entity=${selectedOption}`
        );
        await fetchApi.json();
        console.log('Successfully fetched');
      } catch (error) {
        alert(`Error: ${error}`);
      }
    } else {
      try {
        const fetchApi = await fetch(`/api/get/${this.state.searchValue}`);
        await fetchApi.json();
        console.log('Successfully fetched');
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }

    //Page automatically reloads after data is fetched.
    setTimeout(() => window.location.reload(), 1000);
  }


  //This function loads and displays the content of the two .json files
  componentDidMount() {
    Promise.all([
      fetch('/api/search').then((res) => res.json()),
      fetch('/api/favourites').then((res) => res.json()),
    ]).then(([firstResult, secondResult]) => {
      this.setState({
        isLoaded: true,
        backEndItems: firstResult,
        favouriteListIsLoaded: true,
        favouriteItems: secondResult,
      });
    });
  }

  /*POST request to add search result to favourites. Button & results have the same id, 
  which is used as the unique id to complete the POST request. */
  addToFavourites(event) {
    let indexNumber = event.target.id;

    fetch(`/api/post/${indexNumber}`, {
      method: "POST",
    }).then((res) => res.json());

    //Page automatically reloads after data is posted.
    setTimeout(() => window.location.reload(), 1000);
  }

  //DELETE request. Also uses the button and item to get the unique id.
  removeFromFavourites(event) {
    let indexNumber = event.target.id;

    fetch(`/api/delete/${indexNumber}`, {
      method: "DELETE",
    }).then((res) => res.json());

    setTimeout(() => window.location.reload(), 1000);
  }

  render() {
    //Variables used to ensure that no key values are repeated.
    let favouriteListKey = 100;
    let searchResultKey = 1000;

    const { error, isLoaded, backEndItems, favouriteItems } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Page is loading</div>;
    else {
      return (
       
        <div className="pageContainer">

          <div className="searchBar">
            <div className="searchContainer">
              <h1>Search the iTunes Library</h1>
              <InputGroup className="mb-3">
                <FormControl
                  onChange={this.handleChange}
                  placeholder="Search the itunes library"
                  type="text"
                />
                <Form.Select id="mediaSelect" aria-label="Default select">
                  <option value="">All</option>
                  <option value="movie">Movie</option>
                  <option value="podcast">Podcast</option>
                  <option value="song">Music</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="shortFilm">Short Film</option>
                  <option value="tvShow">TV Show</option>
                  <option value="software">Software</option>
                  <option value="ebook">Ebook</option>
                  <option value="musicVideo">Music Video</option>
                </Form.Select>
                <Button
                  variant="outline-primary"
                  onClick={this.backEndGet}
                  type="button"
                  value="Search"
                >
                  Search
                </Button>
              </InputGroup>
            </div>
          </div>

          <Row className="colContainer">

          <Col className="resultsContainer">

              <h3>Search Results</h3>

              <div>
                <Card className="card">
                  {backEndItems.map((item, index) => (
                    <div key={searchResultKey++}>
                      <Card.Body eventKey={index} id={index}>
                        <Card.Title>
                          <b>Artist or Author Name: </b>{" "}
                          {item.artistName}
                        </Card.Title>
                        <Card.Text>
                          <b>Name:</b> {item.trackName}
                            <br />
                            <b>Album or Collection Name:</b>{" "}
                            {item.collectionName}
                            <br />
                            <b>Media Type:</b> {item.kind}
                            <br />
                            <Button
                              variant="outline-primary"
                              onClick={this.addToFavourites}
                              id={index}
                              type="button"
                            >
                            Add to Favourites
                            </Button> 
                        </Card.Text>
                      </Card.Body>
                      <hr />
                    </div>
                  ))}
                </Card>
              </div>
              
            </Col>
            
            <Col className="resultsContainer">
              <h3>Your Favourites</h3>

              <div>
                <Card className="card">
                  {favouriteItems.map((item, index) => (
                    <div key={favouriteListKey++}>
                      <Card.Body eventKey={index} id={index}>
                        <Card.Title>
                          <b>Artist or Author Name: </b>{" "}
                          {item.artistName}
                        </Card.Title>
                        <Card.Text>
                          <b>Name:</b> {item.trackName}
                            <br />
                            <b>Album or Collection Name:</b>{" "}
                            {item.collectionName}
                            <br />
                            <b>Media Type:</b> {item.kind}
                            <br />
                            <Button
                              variant="outline-danger"
                              onClick={this.removeFromFavourites}
                              id={index}
                              type="button"
                            >
                              Remove from Favourites
                            </Button> 
                        </Card.Text>
                      </Card.Body>
                      <hr />
                    </div>
                  ))}
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  }
}

export default SearchComponent;
