/* Self-note: Be sure to put the terminal in list_app directory
and run this in the terminal to run the JSX automated watcher
npx babel --watch src --out-dir js --presets react-app/prod 

src/app.js our code
js/app.js is the compiled javascript the website runs
*/

// function FilterList

class JokeList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { /* initial state */
            initialJokes: [],
            jokes: [],
            currentPage: 1,
            jokesPerPage: 15,
            type: '',
            searchText: ''
        };
        this.filterList = this.filterList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleType = this.handleType.bind(this);
   
    }

    handleChange(event) {
        // Handles changing the dropdown menu
        const value = event.target.value;
        this.setState({currentPage: 1});
        this.setState((value=='all' ? {type: ''} : {type: value}), this.filterList);
    }

    handleClick(event) {
        // Handles clicking on page numbers
        var x = document.getElementsByClassName("number-button");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].active = false;
        }
        this.setState({currentPage: Number(event.target.id)});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleType(event) {
        // Handles typing in Search
        const value = event.target.value;

        this.setState(({searchText: value.toLowerCase()}), this.filterList);
    }

    componentDidMount() {
        const jokesUrl = "https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json";

        fetch(jokesUrl)
        .then(response => { // Tested 404 errors by changing jokes.html to jokess.html
            if (!response.ok) {
                throw Error((response.status + ": " + response.statusText));
            }
            return response;
        }).then(response => { // Good to go! Parse that JSON!
            response.json()
            .then(data => this.setState({initialJokes: data}))
            .then(()=>{ // We want to manipulate "jokes" while "initialJokes" stays static
                this.setState({jokes: this.state.initialJokes})
            })
        }).catch(error => {
            console.log(error);
            document.getElementById("joke-list").innerHTML = error.message;
        })
        
    }

    filterList(){
        const { initialJokes, type, searchText } = this.state;
         
        var updatedList = initialJokes;
        
        var searchFilter = searchText;
        var currentType = type;

        console.log("search:", searchFilter);
        console.log("type:", currentType);

        updatedList = updatedList.filter(item => {
            if (
                (currentType === item.type || currentType === '') && (
                    // Check all of joke, source, and context for a match
                    item.setup.toLowerCase().search(searchFilter) !== -1 ||
                    item.punchline.toLowerCase().search(searchFilter) !== -1
                )
            ) {
                // True means the item should be included in the filtered array
                return true;
            }
        })

        this.setState({jokes: updatedList});
    }

    render() {
        const { jokes, currentPage, jokesPerPage } = this.state;
        
        // Display current jokes
        const indexOfLastJoke = currentPage * jokesPerPage;
        const indexOfFirstJoke = indexOfLastJoke - jokesPerPage;
        const currentJokes = jokes.slice(indexOfFirstJoke, indexOfLastJoke);

        const renderJokes = currentJokes.map((joke, index) => {
            return (
                <ul className="joke" key = {index}>
                    <li>{joke.setup}</li>
                    <li><i>{joke.punchline}</i></li>
                </ul>
            )
        });
        
        // Display page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(jokes.length / jokesPerPage); i++) {
            pageNumbers.push(i);
        }
        
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key = {number}
                    id = {number}
                    className = "number-button"
                    onClick = {this.handleClick}
                    active = {number === currentPage ? "true" : "false"}
                >
                    {number}
                </li>
            );
        });

        return (
            <div className = "filter-list">
                <form onSubmit={this.handleSubmit}>
                    <fieldset className="form-group">
                        <input type="text" id="search" className="form-control" placeholder="Search" onChange={this.handleType} />
                        <select id="type" onChange={this.handleChange}>
                            <option value="all">All</option>
                            <option value="general">General</option>
                            <option value="knock-knock">Knock-Knock</option>
                            <option value="programming">Programming</option>
                        </select>
                    </fieldset>
                </form>
                <ul id="page-numbers">
                    {renderPageNumbers}
                </ul>
                <ul id="joke-list">
                    {renderJokes}
                </ul>
            </div>
        );
    }
}

// ====== RENDERING TO HTML DOCUMENT ======

ReactDOM.render(
    <JokeList />,
    document.getElementById('app')
);

