
module('jQuery');

test( 'custom option', function(assert)
{
  var prefix = 'custom_option_';

  $.result = null;

  Rekord.jQuery.options.custom = 'Hello World!';

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0', done:false});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );
  deepEqual( $.lastOptions.custom, 'Hello World!' );
});

test( 'override option', function(assert)
{
  var prefix = 'override_option_';

  $.result = null;

  Rekord.jQuery.options.cache = true;

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0', done:false});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );
  deepEqual( $.lastOptions.cache, true );
});

test( 'adjust options', function(assert)
{
  var prefix = 'adjust_options_';

  $.result = null;

  Rekord.jQuery.adjustOptions = function(options)
  {
    options.another = 'yes';
  };

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0', done:false});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );
  deepEqual( $.lastOptions.another, 'yes' );
});

test( 'all', function(assert)
{
  var prefix = 'all_';

  $.result = [
    {id: 2, name: 't2', done: 1},
    {id: 3, name: 't3', done: 0}
  ];

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task',
    load: Rekord.Load.All
  });

  strictEqual( Task.all().length, 2 );
  deepEqual( $.lastOptions.method, 'GET' );
});

test( 'get', function(assert)
{
  var prefix = 'get_';

  $.result = {id: 2, name: 't2', done: 1};

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task',
    load: Rekord.Load.All
  });

  var t2 = Task.fetch(2);

  strictEqual( t2.name, 't2' );
  deepEqual( $.lastOptions.method, 'GET' );
});

test( 'create', function(assert)
{
  var prefix = 'create_';

  $.result = {done: false};

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0'});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );
  strictEqual( t0.done, false );
});

test( 'update', function(assert)
{
  var prefix = 'update_';

  $.result = null;

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0', done: false});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );

  t0.name = 't0a';
  t0.$save();

  deepEqual( $.lastOptions.data, {name: 't0a'} );
  deepEqual( $.lastOptions.method, 'PUT' );
});

test( 'delete', function(assert)
{
  var prefix = 'delete_';

  $.result = null;

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var t0 = Task.create({id: 2, name: 't0', done: false});

  deepEqual( $.lastOptions.data, {id: 2, name: 't0', done: false} );
  deepEqual( $.lastOptions.method, 'POST' );

  t0.$remove();

  deepEqual( $.lastOptions.data, undefined );
  deepEqual( $.lastOptions.method, 'DELETE' );
});

test( 'search get', function(assert)
{
  var prefix = 'search_get_';

  $.result = [
    {id: 2, name: 't2', done: 1},
    {id: 3, name: 't3', done: 0}
  ];

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var search = Task.search('/my/tasks');
  var promise = search.$run();
  var results = search.$results;

  strictEqual( results.length, 2 );
  deepEqual( $.lastOptions.data, {} );
  deepEqual( $.lastOptions.method, 'GET' );
});

test( 'search post', function(assert)
{
  var prefix = 'search_post_';

  $.result = [
    {id: 2, name: 't2', done: 1},
    {id: 3, name: 't3', done: 0}
  ];

  var Task = Rekord({
    name: prefix + 'task',
    fields: ['name', 'done'],
    api: 'task'
  });

  var search = Task.search('/my/tasks', {}, {done: true}, true);
  var results = search.$results;

  strictEqual( results.length, 2 );
  deepEqual( $.lastOptions.data, {done: true} );
  deepEqual( $.lastOptions.method, 'POST' );
});
