var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Self-note: Be sure to put the terminal in list_app directory
and run this in the terminal to run the JSX automated watcher
npx babel --watch src --out-dir js --presets react-app/prod 

src/app.js our code
js/app.js is the compiled javascript the website runs
*/

// function FilterList

var JokeList = function (_React$Component) {
    _inherits(JokeList, _React$Component);

    function JokeList(props) {
        _classCallCheck(this, JokeList);

        var _this = _possibleConstructorReturn(this, (JokeList.__proto__ || Object.getPrototypeOf(JokeList)).call(this, props));

        _this.state = { /* initial state */
            initialJokes: [],
            jokes: [],
            currentPage: 1,
            jokesPerPage: 15,
            type: '',
            searchText: ''
        };
        _this.filterList = _this.filterList.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleType = _this.handleType.bind(_this);

        return _this;
    }

    _createClass(JokeList, [{
        key: 'handleChange',
        value: function handleChange(event) {
            // Handles changing the dropdown menu
            var value = event.target.value;
            this.setState({ currentPage: 1 });
            this.setState(value == 'all' ? { type: '' } : { type: value }, this.filterList);
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            // Handles clicking on page numbers
            var x = document.getElementsByClassName("number-button");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].active = false;
            }
            this.setState({ currentPage: Number(event.target.id) });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            event.preventDefault();
        }
    }, {
        key: 'handleType',
        value: function handleType(event) {
            // Handles typing in Search
            var value = event.target.value;

            this.setState({ searchText: value.toLowerCase() }, this.filterList);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var jokesUrl = "https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json";

            fetch(jokesUrl).then(function (response) {
                // Tested 404 errors by changing jokes.html to jokess.html
                if (!response.ok) {
                    throw Error(response.status + ": " + response.statusText);
                }
                return response;
            }).then(function (response) {
                // Good to go! Parse that JSON!
                response.json().then(function (data) {
                    return _this2.setState({ initialJokes: data });
                }).then(function () {
                    // We want to manipulate "jokes" while "initialJokes" stays static
                    _this2.setState({ jokes: _this2.state.initialJokes });
                });
            }).catch(function (error) {
                console.log(error);
                document.getElementById("joke-list").innerHTML = error.message;
            });
        }
    }, {
        key: 'filterList',
        value: function filterList() {
            var _state = this.state,
                initialJokes = _state.initialJokes,
                type = _state.type,
                searchText = _state.searchText;


            var updatedList = initialJokes;

            var searchFilter = searchText;
            var currentType = type;

            console.log("search:", searchFilter);
            console.log("type:", currentType);

            updatedList = updatedList.filter(function (item) {
                if ((currentType === item.type || currentType === '') && (
                // Check all of joke, source, and context for a match
                item.setup.toLowerCase().search(searchFilter) !== -1 || item.punchline.toLowerCase().search(searchFilter) !== -1)) {
                    // True means the item should be included in the filtered array
                    return true;
                }
            });

            this.setState({ jokes: updatedList });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state2 = this.state,
                jokes = _state2.jokes,
                currentPage = _state2.currentPage,
                jokesPerPage = _state2.jokesPerPage;

            // Display current jokes

            var indexOfLastJoke = currentPage * jokesPerPage;
            var indexOfFirstJoke = indexOfLastJoke - jokesPerPage;
            var currentJokes = jokes.slice(indexOfFirstJoke, indexOfLastJoke);

            var renderJokes = currentJokes.map(function (joke, index) {
                return React.createElement(
                    'ul',
                    { className: 'joke', key: index },
                    React.createElement(
                        'li',
                        null,
                        joke.setup
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'i',
                            null,
                            joke.punchline
                        )
                    )
                );
            });

            // Display page numbers
            var pageNumbers = [];
            for (var i = 1; i <= Math.ceil(jokes.length / jokesPerPage); i++) {
                pageNumbers.push(i);
            }

            var renderPageNumbers = pageNumbers.map(function (number) {
                return React.createElement(
                    'li',
                    {
                        key: number,
                        id: number,
                        className: 'number-button',
                        onClick: _this3.handleClick,
                        active: number === currentPage ? "true" : "false"
                    },
                    number
                );
            });

            return React.createElement(
                'div',
                { className: 'filter-list' },
                React.createElement(
                    'form',
                    { onSubmit: this.handleSubmit },
                    React.createElement(
                        'fieldset',
                        { className: 'form-group' },
                        React.createElement('input', { type: 'text', id: 'search', className: 'form-control', placeholder: 'Search', onChange: this.handleType }),
                        React.createElement(
                            'select',
                            { id: 'type', onChange: this.handleChange },
                            React.createElement(
                                'option',
                                { value: 'all' },
                                'All'
                            ),
                            React.createElement(
                                'option',
                                { value: 'general' },
                                'General'
                            ),
                            React.createElement(
                                'option',
                                { value: 'knock-knock' },
                                'Knock-Knock'
                            ),
                            React.createElement(
                                'option',
                                { value: 'programming' },
                                'Programming'
                            )
                        )
                    )
                ),
                React.createElement(
                    'ul',
                    { id: 'page-numbers' },
                    renderPageNumbers
                ),
                React.createElement(
                    'ul',
                    { id: 'joke-list' },
                    renderJokes
                )
            );
        }
    }]);

    return JokeList;
}(React.Component);

// ====== RENDERING TO HTML DOCUMENT ======

ReactDOM.render(React.createElement(JokeList, null), document.getElementById('app'));