# NumberFlascards

Flashcard webapp to practice japanese numbers

Most of the flashcards app are based on {pre,hand}made decks. With numbers the decks are possibly unlimited ♾ !
This app fills the need for flashcards with generatable data.

## TODO
- SRL
	- [ ] Update generation distribution based on what kind of number are easy/difficult
		- The idea would be to have a score for every digit in every position. This in order to model 'User have trouble with the `3` at the hundred position'
- Settings
	- [ ] Choose which script to display (romaji, hiragana, kanji)
	- [ ] Choose the number generation range
	- Store counter and SRL related into the localStorage
- Render
	- [ ] Add score counter
	- [ ] Make the cards prettier
	- [ ] Add menu for settings
- Long term
	- [ ] Add text2speech to be able to hear the number
	- [ ] Make front be scripts
	- [ ] Make front be speech
	- [ ] Make it abstract for other languages

## Credits
Modified : [swing](https://github.com/gajus/swing)
Used as based and hacked : [react-swing](https://github.com/ssanjun/react-swing)
Inspired from : [stackoverflow codereview](https://codereview.stackexchange.com/questions/78278/simplistic-flash-card-web-app)
Translated to JS : [Convert-Numbers-to-Japanese-flask](https://github.com/Greatdane/Convert-Numbers-to-Japanese-flask)