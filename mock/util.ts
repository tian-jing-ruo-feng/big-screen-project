import fs from 'fs'
import path from 'path'
export default {
  getJsonFile: function(filePath: string) {
    const json = fs.readFileSync(
      path.resolve(__dirname, filePath),
      'utf-8'
    )
    return JSON.parse(json)
  }

}