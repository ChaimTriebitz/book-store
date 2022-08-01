'use strict'

const gRatingColors = ['red', 'orange', 'lightblue', 'lightgreen', 'green']
const gBookNames = [
	'Lord Of The Rings 1',
	'Lord Of The Rings 2',
	'Lord Of The Rings 3',
]
const gImgUrls = ['lotrs1', 'lotrs2', 'lotrs3']
const NUM_OF_BOOKS = 8
var gPageIdx = 0

var gBooks
var gBook
var gSearchBooks
var gPageIdx = 0
var gFilterBy = { maxPrice: 50, minRate: 0 }

_createBooks()
function updateRating(rate) {
	const book = gBooks.find((book) => book.id === gBook.id)
	book.rate = rate
	_saveBooksToStorage()
}

function getBooksForDisplay() {
	var books = []
	if (gSearchBooks !== undefined && gSearchBooks.length === 0) {
		document.querySelector('.not-found').innerText = 'Sorry Not Found'
		return books
	}

	if (gSearchBooks === undefined || gSearchBooks.length === 0) {
		books = gBooks.filter(
			(book) =>
				book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate
		)
	} else {
		books = gSearchBooks.filter(
			(book) =>
				book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate
		)
	}
	books = books.slice(
		gPageIdx * NUM_OF_BOOKS,
		gPageIdx * NUM_OF_BOOKS + NUM_OF_BOOKS
	)
	console.log(gPageIdx)
	document.querySelector('.not-found').innerText = ''

	return books
}

function deleteBook(bookId) {
	console.log(bookId)
	const bookIdx = gBooks.find((book) => bookId === book.id)
	gBooks.splice(bookIdx, 1)
	_saveBooksToStorage()
}

function addBook(name, imgUrl, price) {
	const book = _createBook(name, imgUrl, price)
	gBooks.unshift(book)
	_saveBooksToStorage()
	return book
}
function getBookById(bookId) {
	return gBooks.find((book) => bookId === book.id)
}

function updateBook(bookId, newPrice) {
	const book = gBooks.find((book) => book.id === bookId)
	book.price = newPrice
	_saveBooksToStorage()
	return book
}

function setBookFilter(filterBy = {}) {
	if (filterBy.maxPrice !== undefined) {
		gFilterBy.maxPrice = filterBy.maxPrice
		document.querySelector('.filter-price').innerText = filterBy.maxPrice
	}
	if (filterBy.minRate !== undefined) {
		gFilterBy.minRate = filterBy.minRate
		document.querySelector('.filter-rate').innerText = filterBy.minRate
	}
	return gFilterBy
}

function setSearchBooks(searchName) {
	const books = gBooks.filter((book) => book.name === searchName)
	gSearchBooks = searchName ? books : undefined
}
function setNextPage(sign, elBtn) {
	if (sign === 1 && (gPageIdx + 1) * NUM_OF_BOOKS < gBooks.length) gPageIdx++
	if (sign === -1 && gPageIdx > 0) gPageIdx--
	document.querySelector('.page-idx').innerText = gPageIdx + 1
	console.log(gPageIdx)
}

function _createBooks() {
	var books = loadFromStorage(STORAGE_KEY)
	if (!books || !books.length) {
		books = []
		for (var i = 0; i < 30; i++) {
			const bookIdx = getRandomIntInclusive(0, gBookNames.length - 1)
			const name = gBookNames[bookIdx]
			const imgUrl = gImgUrls[bookIdx]
			books.push(_createBook(name, imgUrl, 0))
		}
	}
	gBooks = books
	_saveBooksToStorage()
}

function _createBook(name, imgUrl, price) {
	return {
		id: makeId(),
		name,
		imgUrl,
		price: price ? price : getRandomIntInclusive(10, 50),
		rate: 1,
	}
}

function _saveBooksToStorage() {
	saveToStorage(STORAGE_KEY, gBooks)
}
