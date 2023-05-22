module.exports = function(Promise, fs, Mkdirp, Exec, Command, git) {
    var helpers;
    helpers = {
        printLogo: function() {
            console.log('\n  ______                  _ __      \n /_  __/___ _____ ___  __(_) /_____ \n  / / / __ `/ __ `/ / / / / __/ __ \\\n / / / /_/ / /_/ / /_/ / / /_/ /_/ /\n/_/  \\__,_/\\__, /\\__,_/_/\\__/\\____/ \n             /_/                    \n');
        },

        correctDir: function(dir) {
            return dir.indexOf('Mozu.') !== -1;
        },

        sort: function(a, b) {
            if (!a.isFulfilled() || !b.isFulfilled()) {
                return 0;
            }

            var va = a.value(),
                vb = b.value();

            if (va.isMerged && !vb.isMerged) {
                return -1;
            }

            if (!va.isMerged && vb.isMerged) {
                return 1;
            }

            if (va.name < vb.name) {
                return -1;
            }

            if (va.name > vb.name) {
                return 1;
            }

            return 0;
        },

        repoWrapper: function(relativePath, fn) {
            Promise.settle(fs.readdirAsync(relativePath).filter(this.correctDir)).then(fn);
        },

        nugetRestore: function(path) {
            return new Promise(function(fullfill, reject) {
                Exec('nuget restore', {
                    cwd: path
                }, function(err, stdout, stderr) {
                    if (err) return console.log('Error restoring nugets');
                    fullfill(stdout);
                });
            });
        },

        buildAndCopyConfigs: function(vars, revision, branchname, root) {

            return new Promise(function(fullfill, reject) {

                var revType = Object.keys(revision)[0],
                    path = root + vars.scratchDir + '\\' + branchname;

                console.log('Building Legacy Configs for ' + revType + ': ' + revision[revType]);

                helpers.nugetRestore(path)
                    .then(function() {
                        Exec(vars.diffConfigVars.buildConfigCommand, {
                            cwd: path + '/Configs'
                        }, function() {

                            fs.copy(path + '/Configs/_legacy', root + vars.diffConfigVars[revType], function() {
                                fullfill(arguments);
                            });

                        });
                    });
            });
        },

        diffConfigs: function(vars, root) {
            console.log('Ready to Compare');
            var cmdstring = [vars.diffConfigVars.diffCommand, '"' + root + vars.diffConfigVars.sourceDir + '"', '"' + root + vars.diffConfigVars.targetDir + '"', ].join(' ');
            Exec(cmdstring, function(err, stdout, stderr) {
                if (vars.verbose) {
                    console.log("difftool invocation string: " + cmdstring);
                    console.log("difftool log: " + stdout);
                    console.log("difftool error: " + stderr);
                }
            });
        },

        tempDir: function(path, create) {
            fs.removeSync(path);
            if (create) Mkdirp.sync(path);
        },

        colorDeployState: function(str, state) {
            if (state === 'Success') {
                return str.green;
            }
            if (state === 'Executing') {
                return str.cyan;
            }
            if (state === 'Failed') {
                return str.red;
            }
            return '';
        },

        weightReleaseVersion: function(version) {
            var ret = 0;

            version.split('.').forEach(function(val, i) {
                ret += Math.pow(1000, (3-i)) * parseInt(val, 10);
            });

            return ret;
        },

        getVars: function(cmdargs, config) {
            var repoList = config.get('repoInformation.repos'),
                inRepo = repoList.some(function(repo) {
                    return repo.name === cmdargs.dir;
                }),
                all = cmdargs.a || (!inRepo && !cmdargs.repos),
                repos,
                name,
                env = (cmdargs.env || 'QA').toUpperCase().split(',');

            if (cmdargs.repos) {
                repos = cmdargs.repos.toUpperCase().split(',');
            } else if (inRepo) {
                repos = [cmdargs.dir.toUpperCase()]
            } else {
                repos = [];
                all = true;
            }

            repos = repoList.filter(function(repo) {
                name = repo.name.toUpperCase().trim();
                return repos.some(function(input) {
                    return name.indexOf(input) > -1;
                });
            });

            if (cmdargs.m) {
                env = ['CI', 'SI', 'QA', 'PERF'];
            }

            return {
                source: cmdargs.source || config.get('source'),
                target: cmdargs.target || config.get('target'),
                remote: cmdargs.remote || config.get('remote'),
                relativePath: cmdargs.path || config.get('path'),
                scratchDir: config.get('scratchDir'),
                operation: cmdargs._[0] || config.get('defaultOperation'),
                file: cmdargs._[1],
                diffConfigVars: config.get('diffConfigVars'),
                verbose: config.get('verbose'),
                env: env,
                all: all,
                every: cmdargs.e,
                repos: repos,
                repo: repos[0],
                results: cmdargs.results || 10
            };
        }
    };

    return helpers;
};