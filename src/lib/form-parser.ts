import { type Files } from 'formidable'
import { IncomingForm } from 'formidable'
import { type Context } from 'swifti'
import { File } from './file-class'

function getFiles(state: any, fields: Files) {
	state.files = {}
	for (const fieldname in fields) {
		const files = fields[fieldname] ?? []
		for (const file of files) {
			const f = new File(file, fieldname)
			if (state.files[fieldname]) {
				state.files[fieldname].push(f)
			} else {
				state.files[fieldname] = [f]
			}
		}
	}
}

export async function formParser(ctx: Context) {
	const form = new IncomingForm()
	const [fields, files] = await form.parse(ctx.req.raw)
	ctx.req.body = {}
	for (const fieldname in fields) {
		const field = fields[fieldname]
		ctx.req.body[fieldname] = field && field.length === 1 ? field[0] : field
		getFiles(ctx.state, files)
	}
}
