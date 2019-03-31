/* eslint-disable */

const { spawn } = require('child_process');

const buildSteps = [
  {
    command: 'mv',
    args: ['./tsconfig.json', './node_modules/tsconfig.json']
  },
  {
    command: 'cp',
    args: ['./tsconfig.build.json', './tsconfig.json']
  },
  {
    command: 'yarn',
    args: ['tsc']
  },
  {
    command: 'cp',
    args: ['./tsconfig.json', './tsconfig.build.json']
  },
  {
    command: 'mv',
    args: ['./node_modules/tsconfig.json', './tsconfig.json']
  }
]

let index = 0
let run = true

function runCommand (step) {
  return new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args);

    child.stderr.on('data', (data) => {
      reject(`stderr: ${data}`)
    });

    child.on('close', (code) => {
      if (code === 0) return resolve()
      reject(`child process exited with code ${code}`)
    });
  })
}

async function runSteps () {
  try {
    for (let step of buildSteps) {
      await runCommand(step)
    }
  } catch (e) {
    console.error(e)
  }
}

runSteps()
