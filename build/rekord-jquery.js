/* rekord-jquery 1.4.2 - A rekord binding to jquery - implementing Rekord.rest by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['Rekord', 'jQuery'], function(Rekord, jQuery) { // jshint ignore:line
      return factory(root, Rekord, jQuery);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global, require('Rekord'), require('jQuery'));  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    root.Rekord = factory(root, root.Rekord, root.jQuery);
  }
}(this, function(global, Rekord, $, undefined)
{

  var noop = Rekord.noop;
  var isEmpty = Rekord.isEmpty;
  var transfer = Rekord.transfer;

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
    all: function( success, failure )
    {
      this.execute( 'GET', null, undefined, this.database.api, success, failure, [] );
    },
    get: function( model, success, failure )
    {
      this.execute( 'GET', model, undefined, this.removeTrailingSlash( this.database.api + model.$key() ), success, failure );
    },
    create: function( model, encoded, success, failure )
    {
      this.execute( 'POST', model, encoded, this.removeTrailingSlash( this.database.api ), success, failure, {} );
    },
    update: function( model, encoded, success, failure )
    {
      this.execute( 'PUT', model, encoded, this.removeTrailingSlash( this.database.api + model.$key() ), success, failure, {} );
    },
    remove: function( model, success, failure )
    {
      this.execute( 'DELETE', model, undefined, this.removeTrailingSlash( this.database.api + model.$key() ), success, failure, {} );
    },
    query: function( url, data, success, failure )
    {
      var method = isEmpty( data ) ? 'GET' : 'POST';

      this.execute( method, null, data, url, success, failure );
    },
    execute: function( method, model, data, url, success, failure, offlineValue )
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

        var options = transfer( Rekord.jQuery.options, {
          method: method,
          data: data,
          url: url,
          success: onRestSuccess,
          failure: onRestError,
          cache: false,
          dataType: 'json'
        });

        Rekord.jQuery.adjustOptions( options, this.database, method, model, data, url, success, failure );
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

  Rekord.setRest( RestFactory, true );

  Rekord.jQuery =
  {
    rest: RestFactory,
    options: {},
    adjustOptions: noop,
    ajax: ajax,
    RestClass: Rest
  };

  return Rekord;

}));
