'use strict'

const through = require('through2')
const fs = require('fs')

const IMPORT_END = '<!-- import end -->'

function importHtml(data, opts) {
    const fileReg = /<!-- @import "(.*)" -->/gi

    return data.replace(fileReg, (match, componentName) => {
        let read_file_content = fs.readFileSync(opts.componentsPath + componentName, {
            encoding: 'utf8'
        });

        if (opts.template) {
            for (let k in opts.template) {
                let k_reg = eval("/" + k + "/g")
                read_file_content = read_file_content.replace(k_reg, opts.template[k])
            }
        }
        console.log('@import: ' + opts.componentsPath + componentName)

        return '<!-- import "' + componentName + '" -->\n' + read_file_content + '\n' + IMPORT_END
    })
}

function restoreHtml(data, opts) {
    const fileReg = eval('/<!-- import "(.*)" -->[^]+' + IMPORT_END + '/gi')

    return data.replace(fileReg, (match, componentName) => {
        let import_component = '<!-- @import "' + componentName + '" -->';
        console.log(import_component)

        return import_component
    })
}

module.exports = function(opts) {
    if (typeof opts === 'string') {
        opts = { componentsPath: opts }
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
        let dataReplace = opts.restore ? restoreHtml(data, opts) : importHtml(data, opts);

        file.contents = new Buffer(dataReplace)
        callback(null, file)
    })
}
