const readline = require('readline');
const util=require('util');
const inputStream=process.stdin;
const outputStream=process.stdout;
const rl = readline.createInterface({
  input: inputStream,
  output: outputStream,
  terminal: true
});
const promptStr='MyApp> ';

// Get the actual length of the string, Chinese 2, English 1
// Chinese in the console occupies the width of 2 English characters
const getDisplayLength=function(str) {
  let realLength = 0, len = str.length, charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};

// Calculate the number of rows and columns occupied by a string in the current console
//outputStream.rows and outputStream.columns properties are uppercase for the window of the current console display
const getStrOccRowColumns=function(str) {
  //str=promptStr+str;
  const consoleMaxRows=outputStream.rows;
  const consoleMaxColumns=outputStream.columns;
  const strDisplayLength=getDisplayLength(str);
  const rows=parseInt(strDisplayLength/consoleMaxColumns,10);
  const columns=parseInt(strDisplayLength-rows*consoleMaxColumns,10);

  return {
    rows,
    columns
  };
};

rl.setPrompt(promptStr);
rl.prompt();

rl.question('Do you want to start application processing?', (answer) => {
  rl.prompt();
  rl.write(util.format('Get a reply to the app: %s\r\n', answer));
  // Update the character information displayed in the same position, update 1 time every 1 second, until 100%
  let k= 0,max=100,prevOutputContent,outputContent,
    cursorDx=0,cursorDy= 0,dxInfo;
    //calculation
  rl.prompt();
  var interval=setInterval(() => {
    if (k<max) {
      k++;
      outputContent=util.format('%d% done!', k);
      // Move the cursor to the front of the characters already written,
      readline.moveCursor(outputStream,cursorDx*-1,cursorDy*-1);
      // Clear all text information after the current cursor, so that the next output information can be written to the console
      readline.clearScreenDown(outputStream);
      outputStream.write(outputContent);
      // Do not use this method, the data written in this method will be read as the input source of the line event
      //rl.write(outputContent);
      dxInfo=getStrOccRowColumns(outputContent);

      cursorDx=dxInfo.columns;
      cursorDy=dxInfo.rows;
    } else {
      outputStream.write(util.format('\r\n'));
      rl.prompt();
      outputStream.write(util.format('%s\r\n','execution complete'));
      clearInterval(interval);
      rl.close();
    }
  },100);
});

rl.on('close',() => {
  process.exit(0);
});