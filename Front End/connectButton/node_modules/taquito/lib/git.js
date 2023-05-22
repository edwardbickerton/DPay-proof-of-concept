var parse = require('./parser');

module.exports = function(Promise, vars, Command) {

    return { 
        fetch: function(dirs) {
            return dirs.map(function(d) {
                return new Promise(function(fulfill, reject) {
                    var dir = d.value();

                    var cmd = new Command(vars.relativePath + dir, 'fetch --all', []);

                    cmd.exec(function(err, stdout, stderr) {
                        if (err)
                            reject(err);

                        fulfill(dir);
                    });
                });
            });
        },

        merged: function(dirs) {
            return dirs.map(function(d) {
                return new Promise(function(fulfill, reject) {
                    var dir = d.value(),
                        cmd = new Command(vars.relativePath + dir, 'branch --merged', [], vars.remote + '/' + vars.target + ' -r');
                    cmd.exec(function(err, stdout, stderr) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var branches = parse.branch(stdout);
                        var ref = `refs/remotes/${vars.remote}/${vars.target}`;
                        var cmd2 = new Command(vars.relativePath + dir, `for-each-ref --format="%(refname)%(authorname)" | grep "${ref}"`);//' vars.remote + '/' + vars.target + ' -r');

                        cmd2.exec(function(err, stdout, stderr) {
                            if (err) {
                                reject(err);
                                return;
                            }

                            fulfill({
                                name: dir,
                                isMerged: branches.others.indexOf(vars.remote + '/' + vars.source) > -1,
                                author: stdout.slice(ref.length).replace(/\n/g, '')
                            });

                        })

                        
                    });
                });
            });
        },

        doesRevisionExist: function(revision) {

            return new Promise(function(fulfill, reject) {

                var cmd = new Command(vars.relativePath + 'Mozu.Config', 'rev-parse --verify ' + revision, [], '');

                cmd.exec(function(err, stdout, stderr) {

                    if (arguments[2]) {
                      return console.log('Revision', revision, 'does not exist. Please try a new revision.');
                    }

                    fulfill(revision);
                });
            });
        },

        checkout: function(branch, revision, path) {

            return new Promise(function(fulfill, reject) {

                var cmd = new Command(path, 'checkout ' + revision, [], '');

                cmd.exec(function(err, stdout, stderr){
                    if (!err) return fulfill(stdout);

                    reject(err);
                });
            });

        },

        contains: function(vars, revision, dir) {
            return new Promise(function(fulfill, reject) {
                var cmd = new Command(vars.relativePath + dir, 'branch --contains ' + revision, [], '');

                cmd.exec(function(err, stdout, stderr) {
                    fulfill(stdout);
                });
            });
        },

        clone: function(branch, dir, url, name) {
            return new Promise(function(fulfill, reject){
                var cmd = new Command(dir, ['clone -b ', branch, url, name].join(' '), [], '');

                cmd.exec(function(err, stdout, stderr) {
                    if (err) {
                        return reject(err);
                    }
                    fulfill(stdout);
                });

            });
        },

        branchesExist: function(dirs) {

            return dirs.map(function(d) {
                return new Promise(function(fulfill, reject) {
                    var dir = d.value(),
                        cmd = new Command(vars.relativePath + dir, 'branch -r', [], '');

                    cmd.exec(function(err, stdout, stderr) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        var branches = parse.branch(stdout),
                            sourceExists = branches.others.indexOf(vars.remote + '/' + vars.source) > -1,
                            targetExists = branches.others.indexOf(vars.remote + '/' + vars.target) > -1;

                        if (!sourceExists) {
                            return reject(dir + ' - Branch ' + vars.source + ' does not exist');
                        }

                        if (!targetExists) {
                            return reject(dir + ' - Branch ' + vars.target + ' does not exist');
                        }

                        fulfill(dir);
                    });
                });
            });
        }
    };
};