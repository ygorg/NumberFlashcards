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

    /* Add spaces every 3 digits */
    let [left, right] = String(props.value).split('.');
    left = left.split('');
    for (var i = 0; i < Math.ceil(left.length / 3) - 1; i++) {
      left.splice(left.length - (i + ((i+1)*3)), 0, ' ');
    }
    left = left.join('');
    let number = [left].concat([right]).filter((e) => e).join('.');

    this.state = {
      number: number,
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
      <Textfit>
        <span className="number">{this.state.number}</span>
        <br />
        {this.props.settings.dispRomaji && 
          <span className="romaji">{this.state.romaji}</span>
        }
        {this.props.settings.dispRomaji && <br />}
        {this.props.settings.dispHiragana && 
          <span className="hiragana">{this.state.hiragana}</span>
        }
        {this.props.settings.dispHiragana && <br />}
        {this.props.settings.dispKanji &&
          <span className="kanji">{this.state.kanji}</span>
        }
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

  rand(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
      );
  }

  next(props) {
    // TODO: Refactor 
    const level = (props||{}).level;
    if (level === 0) {
      // Numbers from 0 to 10
      return this.rand(0, 11)
    } else if (level === 1) {
      // Numbers from 0 to 100
      return this.rand(0, 101)
    } else if (level === 2) {
      // Special cases numbers (300, 800 and so)
      const di = convert.romaji_dict;
      const keys = Object.keys(di).slice(0,-1);
      const ind = parseInt(Math.random() * keys.length);
      return keys[ind];
    } else if (level === 3) {
      // Numbers from 10 to 99 999
      return this.rand(10, 100000);
    }
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

class Settings extends Component{

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    const props = this.props;
    return <div ref={this.ref}>
      {['Romaji', 'Hiragana', 'Kanji'].map((e, i) =>
          <div key={"settingdisp"+String(i)}>
          <label htmlFor={"disp"+e}>{e}</label>
            <input type="checkbox" name={"disp"+e} id={"disp"+e}
              defaultChecked={this.props.settings['disp'+e]}
              onChange={this.props.handleInputChange}/>
          </div>
      )}
      
      Level
        {Array(4).fill(0).map((_, i) =>
          <div key={"settinglevel"+i}>
            <label htmlFor={'level' + i}>{'Level' + i}</label>
            <input
              type="radio" name="level"
              id={'level' + i} value={i}
              defaultChecked={i === this.props.settings.level}
              onChange={this.props.handleInputChange}
            />
          </div>
          )
        }
    </div>;
  }
}

class App extends Component {

  constructor(props, context) {
    super(props, context);

    var generator = new NumberGenerator();

    this.state = {
      seen_cards: 0,
      card_list: [],
      stack: null,
      generator: generator,
      settings: {level: 2, dispRomaji: true},
    };

    // defining defaults values for settings here
    // TODO: maybe refactor so defaults are defined in Settings class

    this.newCard();
    this.newCard();
  }

  newCard() {
    // Add a new number to card_list
    // Also assign the card "key" which is unique for every card
    // TODO: refactor this is not pure
    this.state.seen_cards += 1;
    this.state.card_list.unshift({
      key: this.state.seen_cards,
      number: this.state.generator.next(this.state.settings),
    });
    return {card_list: this.state.card_list,
            seen_cards: this.state.seen_cards};
  }

  handleThrowEnd(e) {
    // Getting the number of the card
    const n = parseInt(e.target.children[0].children[0].textContent, 10);

    // Remove its entry
    const ind = this.state.card_list.indexOf(n);
    var card_list = this.state.card_list.slice();
    card_list.splice(ind, 1);

    // This is not pure but is linked to the fact the newCard is not pure either
    this.state.card_list = card_list;

    // Adding a new number

    let new_state = this.newCard();
    this.setState(new_state);
  }

  settingsHandleInputChange(event) {
    const target = event.target;
    let value = target.type === 'checkbox' ?
      target.checked : target.value;
    const name = target.name;
    let settings = this.state.settings;
    if (name == 'level') {
      value = parseInt(value);
    }
    settings[name] = value;
    this.setState({
      settings: settings,
    })
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
            {this.state.card_list.map((e) =>
              <Card className="card" value={e.number}
                    key={e.key}
                    settings={this.state.settings}/>
            )}
          </ReactSwing>
        </div>
        <Settings settings={this.state.settings}
          handleInputChange={
          (e) => this.settingsHandleInputChange(e)}/>
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
