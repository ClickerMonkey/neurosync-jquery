/* rekord-jquery 1.5.0 - A rekord binding to jquery - implementing Rekord.rest by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['rekord', 'jQuery'], function(Rekord, jQuery) { // jshint ignore:line
      return factory(root, Rekord, jQuery);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global, require('rekord'), require('jQuery'));  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    root.Rekord = factory(root, root.Rekord, root.jQuery);
  }
}(this, function(global, Rekord, $, undefined)
{

  var win = typeof window !== 'undefined' ? window : global; // jshint ignore:line

  var noop = Rekord.noop;
  var transfer = Rekord.transfer;
  var format = Rekord.format;
  var isFormatInput = Rekord.isFormatInput;
  var isEmpty = Rekord.isEmpty;
  var isObject = Rekord.isObject;

  var Rekord_rest = Rekord.rest;

  function Rest(database)
  {
    this.database = database;
  }

  Rest.prototype =
  {
    removeTrailingSlash: function(x)
    {
      return x.charAt(x.length - 1) === '/' ? x.substring(0, x.length - 1) : x;
    },
    buildURL: function(model)
    {
      return this.removeTrailingSlash( Rekord.jQuery.buildURL( this.database, model ) );
    },
    all: function( options, success, failure )
    {
      this.execute( 'GET', null, undefined, this.buildURL(), options, success, failure, [] );
    },
    get: function( model, options, success, failure )
    {
      this.execute( 'GET', model, undefined, this.buildURL( model ), options, success, failure );
    },
    create: function( model, encoded, options, success, failure )
    {
      this.execute( 'POST', model, encoded, this.buildURL(), options, success, failure, {} );
    },
    update: function( model, encoded, options, success, failure )
    {
      this.execute( 'PUT', model, encoded, this.buildURL( model ), options, success, failure, {} );
    },
    remove: function( model, options, success, failure )
    {
      this.execute( 'DELETE', model, undefined, this.buildURL( model ), options, success, failure, {} );
    },
    query: function( url, data, options, success, failure )
    {
      var method = isEmpty( data ) ? 'GET' : 'POST';

      this.execute( method, null, data, url, options, success, failure );
    },
    encode: function(params, prefix)
    {
      var str = [], p;

      for (var p in params)
      {
        if ( params.hasOwnProperty( p ) )
        {
          var k = prefix ? prefix + '[' + p + ']' : p;
          var v = params[ p ];

          str.push( isObject( v ) ? this.encode(v, k) : win.encodeURIComponent( k ) + '=' + win.encodeURIComponent( v ) );
        }
      }

      return str.join('&');
    },
    execute: function( method, model, data, url, extraOptions, success, failure, offlineValue )
    {
      Rekord.debug( Rekord.Debugs.REST, this, method, url, data );

      if ( Rekord.forceOffline )
      {
        failure( offlineValue, 0 );
      }
      else
      {
        var onRestSuccess = function(data, textStatus, jqXHR)
        {
          success( data );
        };

        var onRestError = function(jqXHR, textStatus, errorThrown)
        {
          failure( null, jqXHR.status );
        };

        var vars = transfer( Rekord.jQuery.vars, transfer( model, {} ) );
        var options = transfer( Rekord.jQuery.options, {
          method: method,
          data: data,
          url: url,
          success: onRestSuccess,
          error: onRestError,
          cache: false,
          dataType: 'json'
        });

        if ( isObject( extraOptions ) )
        {
          transfer( options, extraOptions );

          if ( isObject( extraOptions.params ) )
          {
            var paramString = this.encode( extraOptions.params );
            var queryIndex = options.url.indexOf('?');

            options.url += queryIndex === -1 ? '?' : '&';
            options.url += paramString;
          }

          if ( isObject( extraOptions.vars ) )
          {
            transfer( extraOptions.vars, vars );
          }
        }

        Rekord.jQuery.adjustOptions( options, this.database, method, model, data, url, vars, extraOptions, success, failure );

        if ( isFormatInput( options.url ) )
        {
          options.url = format( options.url, vars );
        }

        Rekord.jQuery.ajax( options );
      }
    }
  };

  function RestFactory(database)
  {
    if ( !database.api )
    {
      return Rekord_rest.call( this, database );
    }

    return new Rest( database );
  }

  function ajax(options)
  {
    $.ajax( options );
  }

  function buildURL(db, model)
  {
    return model ? db.api + model.$key() : db.api;
  }

  Rekord.setRest( RestFactory, true );

  Rekord.jQuery =
  {
    rest: RestFactory,
    options: {},
    vars: {},
    adjustOptions: noop,
    ajax: ajax,
    buildURL: buildURL,
    RestClass: Rest
  };

  return Rekord;

}));
