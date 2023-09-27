"use strict";
const { Command } = require('commander');
const figlet = require('figlet');
const path = require("path");
console.log(figlet.textSync("Dir Manager"));
// Initiating CLI program with options
const program = new Command();
program
    .version("1.0.0")
    .description("A CLI to read data files and return back the results in a tabular form")
    .option("-epc, --epc <value>", "command to print which endpoint is called how many times")
    .option("-pmc, --pmc <value>", "command to print how many API calls were being made on per minute basis")
    .option("-scc, --scc <value>", "command to print how many API calls are there in total for each HTTP status code")
    .parse(process.argv); // for parsing command-line arguments
// options
const options = program.opts();
if (options.epc) {
    console.log('epc');
}
if (options.pmc) {
    console.log('pmc');
}
if (options.scc) {
    console.log('scc');
}
//# sourceMappingURL=index.js.map