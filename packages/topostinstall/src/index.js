#!/usr/bin/env node
const toPostInstall = () => {
  console.log('run from the toPostInstall package');
}
toPostInstall();
export { toPostInstall };
