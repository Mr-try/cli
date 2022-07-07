// import inquirer from 'inquirer';
import { Command } from 'commander';
// import confirm from './confirm';
import Project from './project';
import Generate from './generate';

const program = new Command();
program.name('ezt').description('CLI to EasyYa').version('0.0.1');

Project(program);
Generate(program);

program.parse();

// inquirer
//   .prompt(confirm)
//   .then((answers) => {
//     console.log('answers', answers);
//     // Use user feedback for... whatever!!
//   })
//   .catch((error) => {
//     console.log('answers', error);
//     // console.log(chalk.red(`opts!-${error}`));
//   });
