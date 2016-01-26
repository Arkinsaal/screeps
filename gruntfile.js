module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'martin.langdon3@gmail.com',
                password: 'Octopus22!',
                branch: 'default'
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        watch: {
          scripts: {
            files: 'dist/*.js',
            tasks: ['screeps'],
            options: {
              interrupt: true,
            },
          },
        }
    });

    grunt.registerTask('default', ['watch']);
}