import { Command } from 'commander';
import Project from './create.project';
import Generate from './create.generate';
import Api from './create.api';

const program = new Command();
program.name('ezt').description('CLI to EasyYa').version('0.0.7');

// 创建项目
Project(program);

// 生成代码片段
Generate(program);

// 创建or更新api
Api(program);

program.parse();
