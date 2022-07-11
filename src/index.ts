import { Command } from 'commander';
import Project from './project';
import Generate from './generate';

const program = new Command();
program.name('ezt').description('CLI to EasyYa').version('0.0.1');

// 创建项目
Project(program);
// 生成代码片段
Generate(program);

program.parse();
