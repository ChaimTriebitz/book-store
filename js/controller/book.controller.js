'use strict'
function onInit() {
	renderFilterByQueryStringParams()
	renderBooks()
	renderRating(1)
}
function renderFilterByQueryStringParams() {
	const queryStringParams = new URLSearchParams(window.location.search)
	const filterBy = {
		maxPrice: +queryStringParams.get('maxPrice') || 0,
		minRate: +queryStringParams.get('minRate') || 0,
	}

	if (!filterBy.maxPrice && !filterBy.minRate) return

	document.querySelector('.filter-price-range').value = filterBy.maxPrice
	document.querySelector('.filter-rate-range').value = filterBy.minRate
	setBookFilter(filterBy)
}
function renderBooks() {
	const books = getBooksForDisplay()
	const strHtmls = books.map(
		(book) =>
			`<tr>
		<td class="cell-id">${book.id}</td>
		<td class="cell-name">${book.name}</td>
		<td class="cell-price">${book.price}$</td>
		<td>
		<button class="action-btn read-btn" onclick="onReadBook('${book.id}')">Info</button>
		<button class="action-btn update-btn" onclick="onUpdateBook('${book.id}')">Update</button>
		<button class="action-btn delete-btn" onclick="onRemoveBook('${book.id}')">
		Delete
		</button>
		</td>
		<td class="cell-rate">${book.rate}</td>
	</tr>`
	)
	document.querySelector('.books-list').innerHTML = strHtmls.join('')
}
function renderBookImg(imgUrl) {
	const strHTML = `
<img onerror='src="img/book.png"' src="img/${imgUrl}.png" alt="book-img">
`
	document.querySelector('.modal-img').innerHTML = strHTML
}
function renderRating(rate) {
	const elStars = document.querySelectorAll('.fas')
	elStars.forEach((star, idx) => {
		if (idx <= rate) {
			star.classList.add('active')
		} else {
			star.classList.remove('active')
		}
	})
	const elEmojis = document.querySelectorAll('.far')
	elEmojis.forEach((emoji) => {
		emoji.style.transform = `translateX(-${(rate - 1) * 50}px)`
		emoji.style.color = gRatingColors[rate - 1]
	})
}
function onSetFilterBy(filterBy) {
	filterBy = setBookFilter(filterBy)
	renderBooks()

	const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
	const newUrl =
		window.location.protocol +
		'//' +
		window.location.host +
		window.location.pathname +
		queryStringParams
	window.history.pushState({ path: newUrl }, '', newUrl)
}
function onSeachBook(ev) {
	ev.preventDefault()
	const elTxt = document.querySelector('[name=search-book]')
	console.log(elTxt.value)
	setSearchBooks(elTxt.value)
	renderBooks()
	elTxt.value = ''
}
function onAddBook() {
	const name = prompt('Enter Books Name')
	const price = prompt('Enter Books Price')
	const imgUrl = prompt('Enter Books img', 'img name')
	if (name && price) {
		addBook(name, imgUrl, price)
		renderBooks()
	}
}
function onRemoveBook(bookId) {
	var isDeletable = confirm('Are You Sure?')
	if (!isDeletable) return
	deleteBook(bookId)
	renderBooks()
}
function onUpdateBook(bookId) {
	const book = getBookById(bookId)
	const newPrice = +prompt(
		'Enter New Price',
		`Current Price Is: ${book.price}$`
	)
	if (newPrice && newPrice !== book.price) {
		updateBook(bookId, newPrice)
		renderBooks()
	}
}
function onReadBook(bookId) {
	const book = getBookById(bookId)
	document.querySelector('.modal-book-name').innerText = book.name
	document.querySelector('.modal-book-price').innerText = book.price + '$'
	document.querySelector('.modal-book-id').innerText = book.id
	document.querySelector('.modal').classList.remove('hide')
	gBook = book
	renderRating(book.rate)
	renderBookImg(book.imgUrl)
}
function onCloseModal() {
	document.querySelector('.modal').classList.add('hide')
	renderRating(1)
}
function onUpdateRating(value) {
	updateRating(value)
	renderRating(value)
	renderBooks()
}
function onNextPage(elBtn) {
	setNextPage(1, elBtn)
	renderBooks()
}
function onPrevPage(elBtn) {
	setNextPage(-1, elBtn)
	renderBooks()
}
