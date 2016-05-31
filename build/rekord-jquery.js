(function (global, Rekord, $, undefined)
{

  function removeTrailingSlash(x)
  {
    return x.charAt(x.length - 1) === '/' ? x.substring(0, x.length - 1) : x;
  }

  function execute( method, data, url, success, failure, offlineValue )
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

      var options =
      {
        method: method,
        data: data,
        url: url,
        success: onRestSuccess,
        failure: onRestError,
        cache: false,
        dataType: 'json'
      };

      $.ajax( options );
    }
  }

  function RestFactory(database)
  {
    return {
      all: function( success, failure )
      {
        execute( 'GET', undefined, database.api, success, failure, [] );
      },
      get: function( model, success, failure )
      {
        execute( 'GET', undefined, removeTrailingSlash( database.api + model.$key() ), success, failure );
      },
      create: function( model, encoded, success, failure )
      {
        execute( 'POST', encoded, removeTrailingSlash( database.api ), success, failure, {} );
      },
      update: function( model, encoded, success, failure )
      {
        execute( 'PUT', encoded, removeTrailingSlash( database.api + model.$key() ), success, failure, {} );
      },
      remove: function( model, success, failure )
      {
        execute( 'DELETE', undefined, removeTrailingSlash( database.api + model.$key() ), success, failure, {} );
      },
      query: function( url, query, success, failure )
      {
        var method = query ? 'POST' : 'GET';

        execute( method, query, url, success, failure );
      }
    };
  }

  Rekord.setRest( RestFactory, true );

})( this, this.Rekord, this.jQuery );
