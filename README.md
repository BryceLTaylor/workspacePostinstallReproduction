# workspacePostinstallReproduction
reproduces an issue using npm postinstall with npm workspaces

# What happens
When using npm workspaces, if a package (called consumer in my example) consumes another package (called consumed) as a workspace and THAT package uses a postinstall script that calls a third package (called topostinstall) then when you run `npm ci` on the first package (consumer) it will throw an error when it gets to the postinstall:

> npm error code 127
> npm error path /Users/bryce/Documents/LLK/experiments/workspacePostinstallReproduction/packages/consumed
> npm error command failed
> npm error command sh -c topostinstall
> npm error sh: topostinstall: command not found
> npm error A complete log of this run can be found in: /Users/bryce/.npm/_logs/2025-07-18T18_13_25_324Z-debug-0.log

# Reproduce the issue (clone this repository locally first)
1. cd into packages/consumer
2. run `npm ci`
You should see that error.

However, if you instead:
1. cd into packages/consumed
2. run `npm ci` OR `npm install`
3. cd into packages/consumer
4. run `npm install`

You will not get the error.

# What I think is going on
npm ci on the "consumer" package clears the node_modules from each package.  Then it installs the "consumed" package, after which it attempts to run `postinstall`.  However it doesn't end up with anything in the "consumed" package's `node_modules` folder including the `.bin` folder that contains the script run in `postinstall`.  

I suspect that it is looking for the file in the wrong place, but I'm not sure.  

Because `npm install` does not delete `node_modules` it is able to find the files in `.bin`

# context
I discovered this issue in another repo by installing the `patch-package` package in one package and then consuming that package in another package in our monorepo.  We are using npm workspaces.

To reproduce as simply as possible I wanted this test repo to have no external dependencies and I am capable of reproducing the issue with only packages in this monorepo.  I could have reproduced with `patch-package`.  I also saw someone else have a similar issue with a package called `copyfiles`

This was reproduced using npm version 11.4.2 on 7/18/25