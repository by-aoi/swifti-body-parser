import { type Context, Middleware } from 'swifti'
import { getRawBody } from './lib/get-raw-body'
import { rawToJson } from './lib/raw-to-json'
import { type SizeUnit, parseSize } from './lib/parse-size'
import { parseXml } from './lib/raw-to-xml'
import { parseUrlencoded } from './lib/urlencoded'
import { formParser } from './lib/form-parser'

export { type File } from './lib/file-class'

export interface BodyParserOptions {
	limit?: SizeUnit
	errorStatusCode?: number
}

export default class bodyParser {
	private static async getRawBody(ctx: Context, options: BodyParserOptions) {
		const rawBody = await getRawBody(ctx)
		const errorStatusCode = options.errorStatusCode ?? 400

		const limitInBytes = parseSize(options.limit)
		if (rawBody.length > limitInBytes) {
			ctx.res.status(errorStatusCode).json({
				message: 'Request body size exceeds the specified limit',
			})
		}

		return rawBody
	}

	static raw(options: BodyParserOptions = {}) {
		return new Middleware(async (ctx, next) => {
			if (ctx.req.body) return next()
			const rawBody = await this.getRawBody(ctx, options)
			if (!rawBody) return
			next()
		})
	}

	static form(options: Omit<BodyParserOptions, 'limit'> = {}) {
		return new Middleware(async (ctx, next) => {
			const errorStatusCode = options.errorStatusCode ?? 400
			const contentType = ctx.req.headers['content-type']
			if (!contentType || !contentType.includes('multipart/form-data')) return next()
			try {
				await formParser(ctx)
			} catch (error) {
				ctx.res.status(errorStatusCode).json({
					message: 'Error getting request body.',
				})
				return
			}
			next()
		})
	}

	static xml(options: BodyParserOptions = {}) {
		return new Middleware(async (ctx, next) => {
			const contentType = ctx.req.headers['content-type']
			if (!contentType || contentType !== 'application/xml') return next()
			const rawBody = await this.getRawBody(ctx, options)
			ctx.state.rawBody = rawBody
			ctx.req.body = await parseXml(rawBody)
			next()
		})
	}

	static urlencoded(options: BodyParserOptions = {}) {
		return new Middleware(async (ctx, next) => {
			const contentType = ctx.req.headers['content-type']
			if (!contentType || contentType !== 'application/x-www-form-urlencoded') return next()
			const rawBody = await this.getRawBody(ctx, options)
			ctx.state.rawBody = rawBody
			ctx.req.body = await parseUrlencoded(rawBody)
			next()
		})
	}

	static json(options: BodyParserOptions = {}) {
		return new Middleware(async (ctx, next) => {
			const contentType = ctx.req.headers['content-type']
			if (!contentType || contentType !== 'application/json') return next()
			const rawBody = await this.getRawBody(ctx, options)
			ctx.state.rawBody = rawBody
			ctx.req.body = rawToJson(rawBody)
			next()
		})
	}
}
