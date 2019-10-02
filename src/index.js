import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Textfit } from 'react-textfit';
import './index.css';
var swing = require('./swing');
var convert = require('./convert.js');

const Direction = swing.Direction;

class Card extends Component {
  /*
    Card object display a front and a back
  */
  constructor(props) {
    super(props);
    this.state = {
      number: props.value,
      romaji: convert.web_convert(props.value, 'R'),
      kanji: convert.web_convert(props.value, 'K'),
      hiragana: convert.web_convert(props.value, 'H'),
      isFront: true,
    }
  }

  handleClick(e) {
    this.setState({isFront: !this.state.isFront});
  }

  front() {
    return <div className="front">
      <Textfit>
        <span className="number">{this.state.number}</span>
      </Textfit>
    </div>;
  }

  back() {
    return <div className="back">
      <Textfit mode="multi">
        <span className="number">{this.state.number}</span> <br />
        <span className="romaji">{this.state.romaji}</span> <br />
        <span className="hiragana">{this.state.hiragana}</span> <br />
        <span className="kanji">{this.state.kanji}</span>
      </Textfit>
    </div>;
  }

  render(props) {
    return <div
      className="card"
      onClick={(e) => this.handleClick(e)}
      >
      {this.state.isFront ? this.front() : this.back()}
    </div>;
  }
}


class NumberGenerator {
  /* Generate random numbers */
  constructor(props) {
    props = props || {};
    this.state = {
      min: props.min || 0,
      max: props.max || 999999,
    }
  }

  next() {
    return Math.floor(
      Math.random() * (this.state.max - this.state.min + 1) + this.state.min
    );
  }
}

class ReactSwing extends Component {
  /* Rewrite of `react-swing` to allow dynamic creation and destruction of cards */
  /* React wrapper for `swing` js library */

  /* `swing` was modified to not reorder element when stack.createCard is called
  because this was resulting in cards not being created and some created multiple
  time*/
  /* An `update` function was created to automatically add and remove cards based
  on the childrens of the stack DOMElement (pointed by `props.id`) */
  /* All of this so it is possible to add and remove cards by addind/removing
  childs from `props.id` */

  static Events = [
    'throwout',
    'throwoutend',
    'throwoutleft',
    'throwoutright',
    'throwin',
    'throwinend',
    'dragstart',
    'dragmove',
    'dragend',
  ];

  constructor(props) {
    super(props);

    /* Create the Swing stack */
    let stack = swing.Stack(props.id, props.config || {});

    // Bind each event handler passed in props to the stack
    ReactSwing.Events.forEach(eventName => {
      if (this.props[eventName]) {
        stack.on(eventName, this.props[eventName]);
      }
    });

    this.state = {
      stack: stack,
    };
  }

  componentDidMount() {

    const { stack } = this.state;

    // Create new cards and remove non existent ones
    stack.update();

    // React events should be bound to the DOM cards
    // TODO: Do they really ?
    // How to get a link between React Cards and DOM Cards ?

    /*React.Children.forEach(children, (child, i) => {
      let card = stack.createCard(cards[i], false);
      ReactSwing.Events
                .filter( e => child.props[e] )
                .forEach(e => card.on(e, child.props[e]) );
    });*/

    this.setState({
      stack,
    });

    // Makes it possible to have access to the swing.stack in an other object
    if (this.props.setStack) {
      this.props.setStack(stack);
    }
  }

  componentDidUpdate(prevprops) {
    // Create new cards and remove non existent ones
    this.state.stack.update();
  }

  render() {
    // tslint:disable-next-line
    // TODO: `setStack` and `config`  were used here is it usefull ??
    const { children } = this.props;


    // TODO: What does this actually do ?
    return (
      <div id={this.props.id} className={this.props.className}>
        {React.Children
              .map(children, (child, index) => {
                const childProps = Object
                  .keys(child.props)
                  .filter( k => ReactSwing.Events.indexOf(k) === -1)
                  .reduce( (r, k) => {r[k] = child.props[k]; return r}, {});
                  return React.createElement(child.type, childProps);
              })
        }
      </div>
    );
  }
}


class App extends Component {

  constructor(props, context) {
    super(props, context);

    var generator = new NumberGenerator();

    this.state = {
      card_list: [generator.next(), generator.next(), generator.next()],
      stack: null,
      generator: generator,
    };
  }

  handleThrowEnd(e) {
    // Getting the number of the card
    const n = parseInt(e.target.children[0].children[0].textContent, 10);

    // Remove its entry
    const ind = this.state.card_list.indexOf(n);
    var card_list = this.state.card_list.slice();
    card_list.splice(ind, 1);

    // Adding a new number
    card_list.unshift(this.state.generator.next());
    this.setState({card_list: card_list});
  }

  render() {
    /* Render the Swing stack and the cards using card_list */
    return (
      <div>
        <div id="viewport">
          <ReactSwing
            config={{allowedDirections: [
              Direction.RIGHT,
              Direction.LEFT]}}
            id="cardstack"
            className="stack"
            setStack={stack => this.setState({ stack })}
            ref="stackEl"
            throwoutend={e => this.handleThrowEnd(e)}
          >
            {this.state.card_list.map((number, index) =>
              <Card className="card" value={number} key={number}/>
            )}
          </ReactSwing>
        </div>
      </div>
    );

    /* Button to add card by adding a value in card_list */
    /*<div><input type="button" value="Add" onClick={() =>{
          let card_list = this.state.card_list.slice();
          this.setState({card_list:
            card_list.concat([this.state.generator.next()])
          });
        }} /></div>*/
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
