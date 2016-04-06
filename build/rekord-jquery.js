(function ($, global, undefined)
{

  Rekord.rest = function(database)
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
        function onRestSuccess(data, textStatus, jqXHR) 
        {
          success( data );
        }

        function onRestError(jqXHR, textStatus, errorThrown) 
        {
          failure( null, jqXHR.status );
        }

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
      query: function( query, success, failure )
      {
        var method = query.method || 'GET';
        var data = query.data || undefined;
        var url = query.url || query;

        execute( method, data, url, success, failure );
      }
    };

  };

})( jQuery, this );