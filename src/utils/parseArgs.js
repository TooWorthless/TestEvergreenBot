function parseArgs(args) {
    const parsedArgs = {};

    for(const arg of args) {
        parsedArgs[arg.split('=')[0]] = arg.split('=')[1];
    }

    return parsedArgs;
}

export {
    parseArgs
}