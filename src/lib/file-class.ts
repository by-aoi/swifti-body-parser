import fs from 'fs-extra'
import { type File as FormidableFile } from 'formidable'

export class File {
	fieldname: string
	originalname: string | null
	filename: string | null
	size: number
	extname: string | null
	path: string

	constructor(data: FormidableFile, fieldname: string) {
		this.fieldname = fieldname
		this.originalname = data.originalFilename
		this.filename = data.originalFilename
		this.size = data.size
		this.extname = data.originalFilename?.split('.').pop() ?? null
		this.path = data.filepath
	}

	async move(path: string) {
		await fs.copyFile(this.path, path)
		await fs.unlink(this.path)
		this.path = path
	}

	async data() {
		return await fs.readFile(this.path)
	}
}
