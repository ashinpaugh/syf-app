"use strict";

okHealthFilters.filter('StripTags', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);