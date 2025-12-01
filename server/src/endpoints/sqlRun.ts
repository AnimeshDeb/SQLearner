import Docker from 'dockerode';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
let container: any;
  try {
    const sqlquery = req.body.sql || req.body;
    const docker = new Docker();
    
    const initSqlTables=`
    CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, department TEXT);
    INSERT INTO employees (name, salary, department) VALUES ('Alice', 50000, 'Engineering');
    INSERT INTO employees (name, salary, department) VALUES ('Bob',  30000, 'Human Resources');
    `

   
    // Creating tables in docker container before running out query since container comes clean
    const totalquery=`${ initSqlTables}\n${ sqlquery }`

    container = await docker.createContainer({
      Image: 'sql-sandbox', //image that we made in dockerfile

      //passing sql here to run in container from image that we initialized
      // We need to pass in sqlite3 as first parameter so that sqlite can be initialized
      // Even if we have sqlite3 in the dockerfile image, we need to write it here as well
      // to start the system. The commands here don't add to the docker file, it replaces them
      // so we need to write sqlite3 again. The :memory: basically tells docker
      //to run the content (sqlquery) in ram, that we don't have a database.

      //header and column done so that it properly formats into a table
      Cmd: ['sqlite3', '-header','-column',':memory:', totalquery],

      //tty:true basically tells docker that a human is sitting here, that they will add a command prompt,, add color codes, etc.
      //setting it to false basically lets docker know we just want the raw text data

      Tty: false,

      HostConfig: {
        //networkmode none means no internet in and out, no internet access from within the container
        NetworkMode: 'none',

        //memory for container is 100mb, if anything large is inputted container crashes
        Memory: 100 * 1024 * 1024,

        //cpu is 0.5 cores, to prevent them from mining crypto or doing some other stuff
        NanoCpus: 500000000,
      },
    });

    //we initialize container
    await container.start();

    //container runs the query we pass in and quits immediately
    await container.wait();

    //we have to add logs so that we know what happened, will be printed in console along with any errors
    const logs = await container.logs({ stdout: true, stderr: true });

    const cleanOutput=logs.slice(8).toString('utf-8');
    console.log("CLEANEDUTPUT: ", cleanOutput)

    res.json({ output:cleanOutput })

   
    console.log('SQL DATA: ', sqlquery);
  } catch (error) {
    console.log('Error receieving sql query: ', error);
    res.status(500).send('ERROR Receieving sql query');
  } finally{ 
    if(container){ 
        try{ 
            await container.remove({ force:true});
        } catch(error){ console.error("Failed to cleanup container", error) }
     }
   }
});
export default router;
