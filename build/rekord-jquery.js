(function (global, Rekord, $, undefined)
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

})( this, this.Rekord, this.jQuery );
