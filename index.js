'use strict'

const through = require('through2')
const fs = require('fs')

const IMPORT_END = '<!-- import end -->'

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceTemplate(template, contents) {
    if (!template) {
        return contents
    }

    for (let k in template) {
        let k_reg = eval("/" + escapeRegExp(k) + "/g")
        contents = contents.replace(k_reg, template[k])
    }

    return contents
}

function importHtml(data, opts) {
    const fileReg = /<!-- @import "(.*)" -->/gi

    return data.replace(fileReg, (match, componentName) => {
        let read_file_content = fs.readFileSync(opts.componentsPath + componentName, {
            encoding: 'utf8'
        });

        if (opts.nestedIncludes) {
            read_file_content = read_file_content.replace(fileReg, (match, componentName) => {
                let nested_include_content = fs.readFileSync(opts.componentsPath + componentName, {
                    encoding: 'utf8'
                });

                nested_include_content = replaceTemplate(opts.template, nested_include_content)
                console.log('Nested @import: ' + opts.componentsPath + componentName)

                return '<!-- import "' + componentName + '" -->\n' + nested_include_content + '\n' + IMPORT_END
            })
        }

        read_file_content = replaceTemplate(opts.template, read_file_content)
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

    opts.componentsPath = opts.componentsPath || './components/'

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
        data = replaceTemplate(opts.template, data)

        let dataReplace = opts.restore ? restoreHtml(data, opts) : importHtml(data, opts)
        file.contents = new Buffer(dataReplace)

        callback(null, file)
    })
}
