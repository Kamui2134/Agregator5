document.addEventListener('DOMContentLoaded', function () {
	const markers = document.querySelectorAll('.header__language') // marker selector
	const widthGain = 1.5 // Adjusted for larger circle
	const heightGain = 1.5 // Adjusted for larger circle

	let activeMarker = null // Variable to track the active marker with visible circle

	// repeat for all markers
	markers.forEach((marker, index) => {
		// Define variables
		const width = marker.offsetWidth
		const height = 2 * marker.offsetHeight
		const ns = 'http://www.w3.org/2000/svg'

		// if the svg element doesn't exist, create it
		const svg = document.createElementNS(ns, 'svg')

		// Adjust SVG attributes and styles
		svg.style.width = `${width}px`
		svg.style.height = `${height}px`
		svg.style.transform = `scale(${
			(2 * widthGain * width) / height
		}, ${heightGain})`
		svg.setAttribute('width', width)
		svg.setAttribute('height', height)
		svg.setAttribute('viewBox', '-1.5 -1.5 3 3') // Expanded viewBox

		// attach it to the marker element
		marker.appendChild(svg)

		// create the path element
		const path = document.createElementNS(ns, 'path')

		// Set path attributes and styles
		path.setAttribute('pathLength', 100)
		path.setAttribute('vector-effect', 'non-scaling-stroke')
		svg.appendChild(path)

		// Initially, the circle is hidden
		let isCircleVisible = false // Track visibility state for each marker

		if (index === 0) {
			activeMarker = markers[0]
			activeMarker.isCircleVisible = true
			drawCircle(true)
		}

		// Toggle circle visibility on click
		marker.addEventListener('click', () => {
			// Hide circle from the previously active marker, if it's not the same as the clicked one
			if (activeMarker && activeMarker !== marker) {
				const previousPath = activeMarker.querySelector('path')
				previousPath.style.visibility = 'hidden'
				activeMarker.isCircleVisible = false // Reset state for previous marker
			}

			// Toggle visibility of the clicked marker's circle
			if (isCircleVisible) {
				// Circle is visible, so hide it
				path.style.visibility = 'hidden'
				isCircleVisible = false
				activeMarker = null // Reset active marker
			}
			// Circle is hidden, so show it and make this marker the active one
			drawCircle(true)
			isCircleVisible = true
			activeMarker = marker // Update active marker
		})

		// function handles path drawing
		function drawCircle(showElement) {
			if (showElement) {
				path.style.visibility = 'visible'
				path.style.strokeDashoffset = 0 // Ensure path remains visible after click
			}

			const pathLength = 1000 * path.getTotalLength()

			// Set path attributes and styles
			path.setAttribute('d', circlePath(-0.15, 0.05, 150, 190, 0.05, 0.3))
			path.setAttribute('stroke-dasharray', pathLength)
			path.setAttribute('stroke-dashoffset', pathLength)
		}

		// Generates a larger circle path
		function circlePath(
			drMin,
			drMax,
			theta0Min,
			theta0Max,
			dThetaMin,
			dThetaMax
		) {
			const c = 0.551915024494
			const beta = Math.atan(c)
			const d = Math.sqrt(c * c + 1 * 1)
			let r = 1.2 // Increased radius for larger circle
			let theta =
				((theta0Min + Math.random() * (theta0Max - theta0Min)) * Math.PI) / 180
			let path = 'M'

			path += `${r * Math.sin(theta)},${r * Math.cos(theta)}`
			path += ` C${d * r * Math.sin(theta + beta)},${
				d * r * Math.cos(theta + beta)
			}`

			for (let i = 0; i < 4; i++) {
				theta +=
					(Math.PI / 2) *
					(1 + dThetaMin + Math.random() * (dThetaMax - dThetaMin))
				r *= 1 + drMin + Math.random() * (drMax - drMin)
				path += ` ${i ? 'S' : ''}${d * r * Math.sin(theta - beta)},${
					d * r * Math.cos(theta - beta)
				}`
				path += ` ${r * Math.sin(theta)},${r * Math.cos(theta)}`
			}
			return path
		}
	})
})

// FAQ

const questions = document.querySelectorAll('.faq__question')
const questionsBtns = document.querySelectorAll('.faq__question-btn')

for (let i = 0; i < questions.length; i++) {
	questions[i].style.maxHeight =
		questions[i].querySelector('.faq__question-head').clientHeight + 40 + 'px'
}
window.addEventListener('resize', function () {
	for (let i = 0; i < questions.length; i++) {
		if (questionsBtns[i].style.transform != 'rotate(90deg)') {
			questions[i].style.maxHeight =
				questions[i].querySelector('.faq__question-head').clientHeight +
				40 +
				'px'
		} else {
			questions[i].style.maxHeight = questions[i].scrollHeight + 'px'
		}
	}
})

function questionToggle(index) {
	const headHeight = questions[index].querySelector(
		'.faq__question-head'
	).clientHeight // Получаем высоту faq__question-head

	if (questionsBtns[index].style.transform == 'rotate(90deg)') {
		questionsBtns[index].style.transform = 'rotate(45deg)'
		if (window.innerWidth <= 720) {
			questions[index].style.maxHeight = headHeight + 40 + 'px'
		} else {
			questions[index].style.maxHeight = headHeight + 40 + 'px'
		}
	} else {
		questionsBtns[index].style.transform = 'rotate(90deg)'
		questions[index].style.maxHeight = questions[index].scrollHeight + 'px'
	}
}

for (let i = 0; i < questionsBtns.length; i++) {
	questionsBtns[i].addEventListener('click', () => {
		questionToggle(i)
	})
}

// Google Translate
function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{
			pageLanguage: 'en',
			includedLanguages: 'en,fr,de',
			layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
		},
		'google_translate_element'
	)
}

function translatePage(language) {
	const translateSelect = document.querySelector('.goog-te-combo')

	if (translateSelect) {
		// Пустая строка в language вернет страницу к оригиналу (английскому)
		translateSelect.value = language
		translateSelect.dispatchEvent(new Event('change'))

		// Отключение плашки (повторная попытка скрытия в случае загрузки Translate баннера)
		setTimeout(() => {
			const banner = document.querySelector('.goog-te-banner-frame')
			if (banner) banner.style.display = 'none'
		}, 500)
	}
}

// Toggle Btn
const nav = document.querySelector('.header__nav')
const navToggler = document.querySelector('.header__nav-btn')
const navLinks = document.querySelectorAll('.header__nav-link')

navToggler.addEventListener('click', function () {
	this.classList.toggle('active')
	nav.classList.toggle('active')
})

// Paralax Effect
window.addEventListener('scroll', function () {
	const scrollPosition = window.pageYOffset
	const parallaxSection = document.querySelector('.bg-img-1')

	// Коэффициент параллакса: чем меньше значение, тем медленнее движение фона
	const parallaxSpeed = 0.2

	// Вычисляем новое положение фона
	parallaxSection.style.backgroundPositionY = `${
		 -scrollPosition * parallaxSpeed
	}px`
})
