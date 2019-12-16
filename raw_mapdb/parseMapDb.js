var fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

const writeStream = fs.createWriteStream('file.txt');
const pathName = writeStream.path;

function readLines() {
    let fullData = './rawGS4map.dat'
    let testData = './truncatedMapDb.dat'
    
    let counter = 0;
    function updateCount() {
        counter++;
    }

    //Organized for refactor in class objects to build graph
    let locObjModel = new Map()
    locObjModel.set('navOptions', undefined)
    locObjModel.set('mainDesc', undefined)
    locObjModel.set('locDesc', undefined)


        lineReader.eachLine(fullData, function(line) {

            //refactor below when build new model
            getNavigationOptions(line);
            getMainDescription(line);
            getLocationMapData(line);
            
            if(getNavigationOptions(line)) {
                locObjModel.navOptions = getNavigationOptions(line);
            }
            if(getMainDescription(line)) {
                locObjModel.mainDesc = getMainDescription(line);
            }
            if(getLocationMapData(line)) {
                locObjModel.locDesc = getLocationMapData(line);
            }

            //checking if we have built a full model
            //can refactor this away
            tempArray = Object.values(locObjModel)

            if(!tempArray.includes(undefined) && tempArray.length == 3) {
                // get model training and front end mvp then come back and make a fancy graph w/ new models

                console.log(counter)
                updateCount();
                // writeStream.write(locObjModel.locDesc + '\n' + locObjModel.mainDesc + '\n' + locObjModel.navOptions + '\n')
                writeStream.write('\n' + locObjModel.mainDesc + '\n' + '<|endoftext|>' + '\n')
                // console.log(locObjModel.locDesc)
                // console.log(locObjModel.mainDesc)
                // console.log(locObjModel.navOptions)
                locObjModel.navOptions = undefined
                locObjModel.mainDesc = undefined
                locObjModel.locDesc = undefined
            }
    })
}



function getNavigationOptions(line) {
    if(line.includes('Obvious ')) {
        let firstWordIndex = line.indexOf('Obvious');
        let initialProcess = line.substring(firstWordIndex);
        let finalIndex = initialProcess.indexOf(';')
        let processed = initialProcess.substring(0, finalIndex)

        return ('[' + processed.toString() + ']' + '\n' + '<|endoftext|>' + '\n');
    }
}

function getLocationMapData(line) {
    if (line.includes('.jpg') || line.includes('.png') || line.includes(';0;')) {
        let pattern = /(\[(?:\[??[^\[]*?\]))/;
        let regexResult = line.match(pattern);
        if(regexResult) {
        regexResult = regexResult.toString()
        let trimmed = regexResult.substring(0, regexResult.indexOf(']'));

        return (trimmed.toString() + ']');
        }
    }

}

function getMainDescription(line) {
    
    if(line.length > 100 && !line.includes('jpg')) {
        var pattern = /[\w+]+(?:'[a-z\d]+)*|(?<![!?.])[!?.]/g;
        var regexResult = line.toString();
        regexResult = line.match(pattern);
        var myString = '';
        var placeholder = '';

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
        //some bad data with sentences here following i*i pattern or starting with lowercase a
        if (!myString.match(/[0-9]/g)) {
        return (myString.toString());
        };
    }
}

readLines()
