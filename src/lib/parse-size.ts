import { BodyParserError } from './errors'

export type SizeUnit = `${number}mb` | `${number}kb` | `${number}gb` | `${number}tb`

export function parseSize(size: SizeUnit = '10mb') {
	const units = {
		kb: 1024,
		mb: 1024 * 1024,
		gb: 1024 * 1024 * 1024,
		tb: 1024 * 1024 * 1024 * 1024,
	}

	const regex = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/
	const match = size.match(regex)

	if (!match) {
		throw new BodyParserError('Invalid size format')
	}

	const value = parseFloat(match[1])
	const unit = match[2].toLowerCase()

	if (!units[unit]) {
		throw new BodyParserError('Invalid size unit')
	}

	return value * units[unit]
}
