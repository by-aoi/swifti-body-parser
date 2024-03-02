import { type Context } from 'swifti'

export async function getRawBody(ctx: Context): Promise<Buffer> {
	return await new Promise((resolve, reject) => {
		let raw = Buffer.from('')

		ctx.req.raw.on('data', chunk => {
			raw = Buffer.concat([raw, chunk])
		})

		ctx.req.raw.on('end', () => {
			resolve(raw)
		})

		ctx.req.raw.on('error', error => {
			reject(error)
		})
	})
}
