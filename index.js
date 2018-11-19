'use strict'

const through = require('through2')
const fs = require('fs')

function importHtml(data, opts) {
    const fileReg = /<!-- @import\s"(.*)" -->/gi

    return data.replace(fileReg, (match, componentName) => {
        let read_file_content = fs.readFileSync(opts.componentsUrl + componentName, {
            encoding: 'utf8'
        });

        if (opts.template) {
            for (let k in opts.template) {
                let k_reg = eval("/" + k + "/g")
                read_file_content = read_file_content.replace(k_reg, opts.template[k])
            }
        }
        console.log('@import: ' + opts.componentsUrl + componentName)

        return '<!-- import "' + componentName + '" -->\n' + read_file_content + '\n<!-- import end -->'
    })
}

module.exports = function(opts) {
    if (typeof opts === 'string') {
        opts = { componentsUrl: opts }
    }

    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            callback(null, file)
            return
        }

        if (file.isStream()) {
        	console.log('File is stream.' + file.path)
            return
        }

        let data = file.contents.toString()
        let dataReplace = importHtml(data, opts);
        file.contents = new Buffer(dataReplace)

        callback(null, file)
    })
}
