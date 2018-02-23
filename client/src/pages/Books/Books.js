import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

class Books extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: "",

    articles: [],
    topic: "",
    begin: "",
    end: ""
  };



  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };


  saveArticle = event => {
      API.saveArticle({
        title: "testing"
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    
  };


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // Its grabbing the topic, begin and end and throwing them all into topic paramater of the API call as an object.  Leaving begin and end undefined.  


  handleFormSubmit = event => {
    event.preventDefault();
    API.getArticles(
      this.state.topic,
      this.state.begin,
      this.state.end
    )
      .then(res => {
        if (res.data.status === "error") {
          throw new Error(res.data.message);
        } else {
          console.log(res.data.response);

            this.setState({
              articles: res.data.response.docs
            })
          }
          console.log("Articles: " + this.state.articles)
        }
      )
      .catch(err => this.setState({ error: err.message }));

  };

  render() {

    // var articles = this.state.articles;

    return (
      <div>
        <Container fluid>
          <Row>
            <Col size="md-6">
              <Jumbotron>
                <h1>Search for Articles</h1>
              </Jumbotron>
              <form>
                <Input
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  name="topic"
                  placeholder="Topic"
                />
                <Input
                  value={this.state.begin}
                  onChange={this.handleInputChange}
                  name="begin"
                  placeholder="Start Year"
                />
                <TextArea
                  value={this.state.end}
                  onChange={this.handleInputChange}
                  name="end"
                  placeholder="End Year"
                />
                <FormBtn
                  // disabled={!(this.state.author && this.state.title)}
                  onClick={this.handleFormSubmit}
                >
                  Article Search
              </FormBtn>
              </form>
            </Col>
            <Col size="md-6 sm-12">
              <Jumbotron>
                <h1>Books On My List</h1>
              </Jumbotron>
              {this.state.books.length ? (
                <List>
                  {this.state.books.map(book => (
                    <ListItem key={book._id}>
                      <Link to={"/books/" + book._id}>
                        <strong>
                          {book.title} by {book.author}
                        </strong>
                      </Link>
                      <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                  <h3>No Results to Display</h3>
                )}
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col size="md-6">
              <Jumbotron>
                <h1>Article Search Results</h1>
              </Jumbotron>
              <List>
             
                  {this.state.articles.map(article => (
                    <ListItem key={Math.random()}>
                      {article.headline.main}
                      <SaveBtn onClick={() => this.saveArticle()}/>
                    </ListItem>
                  ))}
                </List>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Books;
