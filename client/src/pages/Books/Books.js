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
    savedArticles: [],
    topic: "",
    begin: "",
    end: ""
  };


  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = () => {
    API.getSavedArticles()
      .then(res =>
        this.setState({ savedArticles: res.data, title: "", date: "" })
      )
      .catch(err => console.log(err));
  };

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };


  saveArticle = event => {
    console.log("save article: " + event)
      API.saveArticle({
        title: event
      })
        .then(res => this.loadArticles())
        .catch(err => console.log(err));
    
  };


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };



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
                  onClick={this.handleFormSubmit}
                >
                  Article Search
              </FormBtn>
              </form>
            </Col>
            <Col size="md-6 sm-12">
              <Jumbotron>
                <h1>Saved Articles</h1>
              </Jumbotron>
              {this.state.savedArticles.length ? (
                <List>
                  {this.state.savedArticles.map(article => (
                    <ListItem key={article._id}>
                        <strong>
                          {article.title}  - ({article.date})
                        </strong>
                      <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
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
                    <ListItem key={article.headline.main}>
                      {article.headline.main}
                      <SaveBtn onClick={() => this.saveArticle(article.headline.main)}/>
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
