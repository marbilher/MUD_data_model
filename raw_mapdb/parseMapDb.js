var fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

function readLines() {
    let fullData = './rawGS4map.dat';
    let testData = './truncatedMapDb.dat';
    let counter = 0;

    function updateCount() {
        counter++;
    }

        lineReader.eachLine(testData, function(line) {
            getLocationMapData(line);
            getMainDescription(line, updateCount);
            //console.log(counter);
            getNavigationOptions(line);
            
    })
}

function getNavigationOptions(line) {
    if(line.includes('Obvious ')) {
        let firstWordIndex = line.indexOf('Obvious');
        let initialProcess = line.substring(firstWordIndex);
        let finalIndex = initialProcess.indexOf(';')
        let processed = initialProcess.substring(0, finalIndex)
        console.log('[' + processed + ']');
    }
}

function getLocationMapData(line) {
    if (line.includes('.jpg') || line.includes('.png') || line.includes(';0;')) {
        let pattern = /(\[(?:\[??[^\[]*?\]))/;
        let regexResult = line.match(pattern);
        if(regexResult) {
        regexResult = regexResult.toString()
        let trimmed = regexResult.substring(0, regexResult.indexOf(']'));

        console.log(trimmed + ']');
        }
    }

}

function getMainDescription(line, updateCount) {
    
    //your main shortcut here is line length but many descriptions are gonna be under 500
    if(line.length > 200 && !line.includes('jpg')) { //you and jpg to avoid non-description lines
        var pattern = /[\w+]+(?:'[a-z\d]+)*|(?<![!?.])[!?.]/g;
        var regexResult = line.toString();
        regexResult = line.match(pattern); //can you grab line+1 to get the [East Florywn] identifier
        var myString = '';
        var placeholder = '';
        updateCount();

        for(var i = 0; i < regexResult.length; i++) {
            myString = placeholder;
            if(regexResult[i + 1] == '.') {
            placeholder = myString.concat(regexResult[i].toString() +'. ');
            } else if (regexResult[i].length == 1 && regexResult[i] != 'A' && regexResult[i] != 'a')   {
                placeholder = myString.concat('');
            } else {
                placeholder = myString.concat(regexResult[i].toString() + ' ');
            } 
        }

        console.log(myString);
        // console.log('\n')
        console.log('<|endoftext|>')
        console.log('\n')
    }
}

readLines()