import Docker from 'dockerode';
import express, { Request, Response } from 'express';
import { problems, Problem } from '../../data/problems';

const router = express.Router();

//function to clean docker outputs in case docker puts output across multiple
//different lines (at which case # is added)

function getCleanOutput(buffer:Buffer):string{
  let output = '';
    let current = 0;

    while (current < buffer.length) {
        // Docker header is 8 bytes. 
        // Bytes 0-3: Stream type (1=stdout, 2=stderr) - we usually want both or just stdout
        // Bytes 4-7: Payload size (UInt32 Big Endian)
        
        if (current + 8 > buffer.length) break; // Incomplete header

        // Read the size of the payload from bytes 4-7
        const payloadSize = buffer.readUInt32BE(current + 4);
        
        // Move index past header
        current += 8;

        if (current + payloadSize > buffer.length) break; // Incomplete payload

        // Extract the payload string
        const chunk = buffer.slice(current, current + payloadSize);
        output += chunk.toString('utf-8');

        // Move index to start of next header
        current += payloadSize;
    }
    return output;
 }
async function executeAndParseJson(initSql:string, query:string):Promise<any>
{
  let tempContainer:any;
  const totalQuery=`${initSql }\n${ query}`;

  try{
    const docker=new Docker();


    tempContainer=await docker.createContainer({ 
      Image:'sql-sandbox',
      Cmd:['sqlite3', '-json', ':memory:', totalQuery],
      Tty:false,
      HostConfig:{
        NetworkMode:'none',
        Memory:100*1024*1024,
        NanoCpus:500000000,
       },
    });
    await tempContainer.start()
    await tempContainer.wait({timeout:5 });

    const logs=await tempContainer.logs({stdout:true, stderr:true });

    //docker attaches some binary data at the beginning of every stream of data it sends back.
    //By doing slice(8), we skip the 8 bytes of unreadable data, without which the JSON.parse() would be giving syntax error.
    //Our data that we need (result of sql) is after the 8 bytes of binary data.

    const rawOutput=getCleanOutput(logs)


    //need bottom 2 lines because the sqlite output returns the sql query AND the result, we only want the result

    const trimmedOutput=rawOutput.trim()//removing leadning/trailing whitespace and non-printable chars
    const jsonMatch=trimmedOutput.match(/\[.*?\]/s)

    //found valid array. jsonMatch checks if a valid array is found and since regex returns 
    // an object, jsonMatch[0] refers to the first index which is the actual result we are looking for.
    if(jsonMatch && jsonMatch[0]){
      try{ 
        //parsing the result into proper json (array object)
      return JSON.parse(jsonMatch[0]);;
    }
    catch(e){
      console.error('Failed to jso.parse extracted output:', jsonMatch[0])
      throw new Error(`Inavlid json output from sql execution.`);
     }
     } else { 
      throw new Error(`SQL Error or Empty Output: ${rawOutput.trim()}`); 
    }
    
   } finally{ 
    if(tempContainer){ 
      await tempContainer.remove({force:true });
    }
   }



}
//any[] refers to an array of objects
function compareQueryResults(userResult:any[], expectedResult: any[]):boolean {
  
  //in the case where the output is simple (SELECT COUNT(*)) values or single-value results or error structures, 
  //we just compare the plain stringified versions and return accordingly
  if(!Array.isArray(userResult) || !Array.isArray(expectedResult)){
    return JSON.stringify(userResult)===JSON.stringify(expectedResult);
   }

   //if we get a valid array of objects result

   //sorting rows in predictable order, doing data.sort is sorting an array of objects data

   //sql results can have any different columns/properties and the userresult and correctreslt can return these properties in different order
   // We essentially convert the entire objects into string representations and use localeCompare to sort these strings alphabetically,
   //so that the user result and correct result can be compared successfully.
   const normalize=(data:any[])=>data.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));

   //we do stringify twice. Once within normalize to sort the arrays and once outside below.
   // The reason being that when we initially do stringify to compare the results, they get temporarily converted into strings
   //and the result is actually an array of objects. This is why we do JSON.stringify again
   // so that we can do a final comparison.
   const normalizedUser=JSON.stringify(normalize(userResult));
   const normalizedExpected=JSON.stringify(normalize(expectedResult));

   //returning if the string converted versions of the arrays are same. If result match, we return true or false if no match.
   return normalizedUser===normalizedExpected
 }



router.post('/', async (req: Request, res: Response) => {
let problem: Problem | undefined;

try{
  const userQuery:string=req.body.sql;
  const slug: string=req.body.slug;

  problem=problems.find(p=>p.slug===slug);
  if(!problem){
    return res.status(404).json({status:'error', message:'Problem not found.' });

   }

   const initSqlTables:string=problem.sourceTableQuery;

   //execute user query and parse user json

   const userResultData=await executeAndParseJson(initSqlTables, userQuery);

   //running correctquery and parsing correct query

   const expectedResultData=await executeAndParseJson(initSqlTables, problem.correctQuery);

   //comparing parsed json data for user and correct

   const isMatch=compareQueryResults(userResultData, expectedResultData);

   return res.json({
    status:'success',
    isCorrect:isMatch,
    userOutput: userResultData,
    expectedOutput: expectedResultData,
    title: problem.title
    });



 }
 catch(error:any){
  console.error('Execution pipeline failed: ', error.message);

  return res.status(500).json({
    status:'system_error',
    message:error.message || 'Unknown Server Error during execution.'
   });
  }

});
export default router;
