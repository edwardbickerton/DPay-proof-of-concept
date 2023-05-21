var cmdargs = require('yargs').argv,
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs-extra')),
    Exec = require('child_process').exec,
    Mkdirp = require('mkdirp'),
    cliff = require('cliff'),
    clc = require('cli-color'),
    Command = require('./lib/command'),
    helpers = require('./lib/helper')(Promise, fs, Mkdirp, Exec, Command),
    config = require('config'),
    persist = require('node-persist'),
    moment = require('moment'),
    inquirer = require('inquirer'),
    jsonfile = require('jsonfile');

var vars = helpers.getVars(cmdargs, config),
    git = require('./lib/git')(Promise, vars, Command),
    octopus = require('./lib/octopus');

var operations = {
    

    fetch: function() {

        console.log('Fetching all branches \n');

        helpers.repoWrapper(vars.relativePath, function(dirs) {

            Promise.settle(git.fetch(dirs))
                .then(function(values) {
                    values.forEach(function(val) {
                        console.log(val.value());
                    });
                });
        });
    },

    releases: function() {

        if (!vars.repo) {
            return console.log('ERROR:'.red, 'Must been inside a tracked repository or specificy one with --repo argument');
        }

        Promise.settle([operations._deploysDetail(), octopus.api.releases(vars.repo.name)])
            .then(processReleases);

        function processReleases(results) {
            var data = results[1].value(),
                noteRegex = /Branch: (.*)\. Release created.* by (.*) via ([a-zA-Z\s]*)\./,
                rows;
            console.log('');

            rows = [
                    ['Release'.red, 'When'.red, 'Branch'.red, 'User'.red]
                ]
                .concat(data.Items.map(function(rel) {
                    var matches = (rel.ReleaseNotes || '').match(noteRegex) || [];

                    return [rel.Version, moment(rel.LastModifiedOn).fromNow(), matches[1] || '', matches[2] || ''];
                }));

            rows.splice(vars.results + 1)

            console.log(cliff.stringifyRows(rows));
        };
    },

    deploys: function() {
        this[vars.all || vars.repos.length > 1 ? '_deploysList' : '_deploysDetail']();
    },

    _deploysDetail: function() {
        
        console.log('Legend:', 'Latest'.inverse, 'Success'.green, 'Deploying'.cyan, 'Failed'.red, '\n');

        return new Promise(function(fulfill, reject) {
            octopus.api.dashboard()
                .then(function(data) {
                    var rows = [
                            ['Env'.red, 'Release'.red, 'When'.red, 'Time'.red]
                        ],
                        project,
                        item,
                        maxWeight = 0,
                        maxIndices = [];



                    project = data.Projects.find(function(proj) {
                        return proj.Name === vars.repo.name;
                    });

                    if (!project) {
                        console.log('ERROR:'.red, 'Unable to find octopus project', vars.repo);
                        return;
                    }

                    console.log('\t' + vars.repo.name.magenta.bold + '\n');



                    data.Environments.forEach(function(env) {
                        var row,
                            item,
                            weight;

                        if (!octopus.helpers.validEnvironment(vars, env.Name)) {
                            return;
                        }

                        if ((env.Name.match(/HP/) && !vars.repo.hp) || (env.Name.match(/(SB)|(TP)/) && !vars.repo.tp)) {
                            return;
                        }

                        item = data.Items.find(function(item) {
                            return item.EnvironmentId === env.Id && item.ProjectId === project.Id;
                        });

                        if (!item) {
                            return;
                        }

                        weight = helpers.weightReleaseVersion(item.ReleaseVersion);

                        if (weight === maxWeight) {
                            maxIndices.push(rows.length);
                        } else if (weight > maxWeight) {
                            maxWeight = weight;
                            maxIndices = [rows.length];
                        }

                        rows.push([env.Name, helpers.colorDeployState(item.ReleaseVersion, item.State), moment(item.CompletedTime).fromNow(), item.CompletedTime]);
                    });

                    if (maxIndices.length) {
                        maxIndices.forEach(function(index) {
                            rows[index][1] = rows[index][1].inverse;
                        });
                    }


                    console.log(cliff.stringifyRows(rows));
                    fulfill();
                });
        });
    },

    _deploysList: function() {

        if (!Array.prototype.find) {
            console.log(clc.red('ERROR:'), 'Must run node in --harmony mode to run this function');
            return;
        }

        console.log('Legend:', 'Latest'.inverse, 'Success'.green, 'Deploying'.cyan, 'Failed'.red, '\n');

        octopus.api.dashboard()
            .then(function(data) {

                helpers.repoWrapper(vars.relativePath, function(dirs) {

                    var rows = [
                            [clc.red('Repository')]
                        ],
                        environments = [],
                        projects;


                    data.Environments.forEach(function(env) {
                        env.Name = env.Name.toUpperCase();
                        if (octopus.helpers.validEnvironment(vars, env.Name)) {
                            rows[0].push(clc.red(env.Name));
                            environments.push(env);
                        }
                    });

                    projects = dirs.map(function(dir) {
                        return data.Projects.find(function(proj) {
                            return proj.Name === dir.value();
                        });
                    }).filter(function(proj) {
                        return proj && (vars.all || vars.repos.some(function(name) {
                            return proj.Name.indexOf(name.trim()) > -1;
                        }));
                    });

                    projects.forEach(function(proj) {
                        var repo,
                            maxWeight = 0,
                            maxIndices = [];

                        if (!proj) {
                            return;
                        }

                        repo = config.get('repoInformation.repos').find(function(repo) {
                            return repo.name === proj.Name;
                        });

                        if (!repo) return;

                        proj.hp = repo.hp;
                        proj.tp = repo.tp;

                        rows.push([proj.Name].concat(environments.map(function(env, index) {
                            var item = data.Items.find(function(item) {
                                    return item.EnvironmentId === env.Id && item.ProjectId === proj.Id;
                                }),
                                release,
                                weight,
                                ret;

                            if (!item || (env.Name.match(/HP/) && !proj.hp) || (env.Name.match(/(SB)|(TP)/) && !proj.tp)) {
                                return '--------';
                            }
                            
                            weight = helpers.weightReleaseVersion(item.ReleaseVersion);

                            if (weight === maxWeight) {
                                maxIndices.push(index);
                            } else if (weight > maxWeight) {
                                maxWeight = weight;
                                maxIndices = [index];
                            }

                            return helpers.colorDeployState(item.ReleaseVersion, item.State);
                        })));
                        
                        if (maxIndices.length) {
                            maxIndices.forEach(function(index) {
                                rows[rows.length - 1][index + 1] = rows[rows.length - 1][index + 1].inverse;
                            });
                        }
                    });

                    console.log(cliff.stringifyRows(rows));
                });
            });

        
    },

    _dumpVars: function() {
        console.log(vars);
    },

    clone: function() {
        helpers.repoWrapper(vars.relativePath, function(dirs) {
            var repoInformation = config.get('repoInformation'),
                dirValues = dirs.map(function(dir) {
                    return dir.value()
                }),
                diff = repoInformation.repos.filter(function(repo) {
                    return dirValues.indexOf(repo.name) < 0
                }),
                choices = diff.map(function(repo) {
                    return {
                        name: repo.name
                    };
                });

            if (!choices.length) {
                console.log('There are no repos to clone');
                return;
            }

            inquirer.prompt([{
                type: 'checkbox',
                message: 'Select Repos to Clone:',
                name: 'repos',
                choices: choices
            }], function(answers) {
                if (!answers.repos.length) {
                    return;
                }

                console.log('Cloning selected repositories');

                Promise.settle(answers.repos.map(function(repo) {
                        return git.clone('master', vars.relativePath, repoInformation.baseUrl + repo, repo);
                    }))
                    .then(function(results) {
                        results.forEach(function(r) {
                            if (r.isRejected()) {
                                console.log(r.reason());
                            }
                        });
                        console.log('Cloning complete');
                    });
            });
        });
    },

    listRepos: function() {
        helpers.repoWrapper(vars.relativePath, function(dirs) {
            dirs.map(function(dir) {
                    return dir.value();
                })
                .sort()
                .forEach(function(name, i) {
                    console.log('\t' + (i + 1) + '.\t' + name);
                });
        });
    },

    diffConfig: function() {

        // source for this operation will default to current version of configs -- whatever is in the working dir
        // target will be the SHA or branch provided --, if target is not provided it will default to master

        console.log('Diffing Configs for', vars.source, 'and', vars.target);

        Promise.settle([git.doesRevisionExist(vars.source), git.doesRevisionExist(vars.target)]).then(function() {

            var tempbranchname = 'Configs';

            helpers.tempDir(__dirname + vars.diffConfigVars.targetDir, true);
            helpers.tempDir(__dirname + vars.diffConfigVars.sourceDir, true);
            helpers.tempDir(__dirname + vars.scratchDir, true);

            git.clone('1.17', __dirname + vars.scratchDir, 'http://tfs.corp.volusion.com:8080/tfs/VNext/v2Mozu/_git/Mozu.Config', tempbranchname)
                .then(git.checkout.bind(this, 'Mozu.Config', vars.source, __dirname + vars.scratchDir + '/' + tempbranchname))
                .then(helpers.buildAndCopyConfigs.bind(this, vars, {
                    sourceDir: vars.source
                }, tempbranchname, __dirname))
                .then(git.checkout.bind(this, 'Mozu.Config', vars.target, __dirname + vars.scratchDir + '/' + tempbranchname))
                .then(helpers.buildAndCopyConfigs.bind(this, vars, {
                    targetDir: vars.target
                }, tempbranchname, __dirname))
                .then(helpers.diffConfigs.bind(this, vars, __dirname));

        });

    },

    checkMerge: function() {

        console.log('Checking Merge: Is', vars.source, 'merged into', vars.target, '\n');

        helpers.repoWrapper(vars.relativePath, function(dirs) {

            Promise.settle(git.branchesExist(dirs))
                .then(git.merged)
                .then(Promise.settle)
                .then(function(values) {
                    var rows = [
                            ['Project'.red, 'Merged'.red, 'Owner'.red]
                        ];

                    values.sort(helpers.sort)
                        .forEach(function(val) {

                            
                            var row = [];

                            if (val.isFulfilled()) {
                                var name = val.value().name;

                                if (!val.value().isMerged) {
                                    name = name.red;
                                }

                                row.push(name);

                                row.push(val.value().isMerged ? 'OK'.green : 'FAIL'.red);

                                row.push(val.value().author);

                                rows.push(row);
                            }


                        });

                    console.log(cliff.stringifyRows(rows));
                });
        });
    },

    themes: function() {
        var results = {}
        var promises = []
        var rows = [['id', 'Name', 'Extends', 'Overridden']]
        
        config.get('themes').forEach((theme) => {
            const id = theme.id
            const split = id.split('~')
            const path = config.get('themesPath') + '/' + split[1] + '/' + split[2] + '/'
            const name = theme.name

            results[id] = {
                name: name
            }

            promises.push(new Promise((fulfill, reject) => {
                const themeJson = path + 'theme.json' 
                fs.stat(themeJson, (err, stats) => {
                    if (!stats) {
                        return fulfill();
                    }
                    jsonfile.readFile(themeJson, (err, obj) => {
                        if (obj && obj.about) {
                            results[id]['extends'] = obj.about['extends'];
                            results[id]['themeName'] = obj.about['name'];
                        }
                        fulfill();
                    })
                })
            }))

            promises.push(new Promise((fulfill, reject) => {
                const themeFile = path + vars.file
                fs.stat(themeFile, (err, stats) => {
                    if (stats && stats.isFile()) {
                        results[id].overridden = true
                    }
                    fulfill();
                })
            }))
        })

        console.log('\nIs ' + vars.file.blue + ' overridden in the themes?\n');

        Promise.settle(promises)
            .then(() => {
                for (var id in results) {
                    const theme = results[id]
                    var row = []

                    rows.push(row);

                    row.push(id)
                    row.push(theme.themeName || '')
                    row.push(theme['extends'] || '')
                    row.push(theme.overridden ? 'Yes'.red : 'No'.green)

                }

                console.log(cliff.stringifyRows(rows))
            })
    },

    buildScripts: function() {
        console.log(config.get('buildScripts.script'))
        console.log(vars.relativePath + config.get('buildScripts.path'))
        var spawn = require('child_process').spawn,
            ls = spawn('cmd.exe', [
                '/c',
                config.get('buildScripts.script')
            ], {
                cwd: vars.relativePath + config.get('buildScripts.path')
            });

        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            console.log('child process exited with code ' + code);
        });
    },

    help: function() {
        console.log('Possible Commands:', '\n', '-', Object.keys(this).filter(function(k) {
            return k.indexOf('_') !== 0;
        }).join('\n - '));
    }
};


helpers.printLogo();

if (operations[vars.operation]) {
    operations[vars.operation]();
} else {
    console.log('Unknown Command: ', vars.operation, '\n');
    operations.help();
}