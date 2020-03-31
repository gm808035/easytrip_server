const fs =require('fs')
const path = require('path')
fs.mkdir(path.join(__dirname, 'test'), (err)=>{
    if (err){
        throw err
    }
    console.log('File is created')

})
const filePath = path.join(__dirname,'test','test.txt')

fs.writeFile(filePath, 'hello file,it`s gm', err =>{
    if (err){
        throw err
    }
    console.log('File is created ')
})

/*const chalk = require('chalk')
const text = require('./data')
console.log(chalk.blue('hello altynai, u can take it!'))
console.log(chalk.green(text))
console.log(__dirname)*/