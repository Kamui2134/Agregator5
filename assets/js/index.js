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
