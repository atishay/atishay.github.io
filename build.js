const cp = require("child_process");
const rcs = require("rename-css-selectors");
const path = require("path");
(async () => {
  cp.execSync(`hugo --minify --baseURL ${process.env.DEPLOY_URL}`, { cwd: __dirname, stdio: [0, 1, 2] });
  rcs.loadMapping('./renaming_map.json');
  await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], { newPath: 'public', cwd: path.resolve(__dirname, './public') });
  await rcs.generateMapping('./', { overwrite: true });
  // cp.execSync("../node_modules/.bin/terser *.js --mangle-props keep_quoted -c -m", { cwd: path.resolve(__dirname, './public'), stdio: [0, 1, 2] });
})();



