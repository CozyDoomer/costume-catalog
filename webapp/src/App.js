import React, {Component} from 'react';
import ApolloClient, {gql} from 'apollo-boost';
import {Costumes} from "./costumes/Costumes";
import {SearchBox} from "./search/SearchBox";

export class App extends Component {
    client = new ApolloClient({
        uri: `${process.env.REACT_APP_API_URL}/query`
    });
    state = {
        costumes: [],
        search: ""
    };
    updateSearch = (search) => {
        this.setState({search: search});
        this.requestCostumes(search)
    };

    componentDidMount() {
        this.requestCostumes(this.state.search);
    }

    requestCostumes(search) {
        this.client.query({
            query: gql`
                {
                    costumes(tag: "${search}") {
                        name,
                        description,
                        picture,
                        location,
                        tags{
                            name,
                            icon,
                            importance
                        }
                    }
                }
            `
        })
        .then(result => this.setState({
            costumes: result.data.costumes
        }));
    }

    render() {
        return <div className="container collection">
            <SearchBox search={this.state.search} updateSearch={this.updateSearch}/>
            <Costumes costumes={this.state.costumes}
                         search={this.state.search} updateSearch={this.updateSearch}/>
        </div>;
    }
}
