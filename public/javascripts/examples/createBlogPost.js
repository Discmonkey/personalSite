var app = angular.module('CreatePost');

app.controller('BlogPost',BlogPost);

BlogPost.inject = ['$scope','$log'];
var BlogPost = function($scope,$log) {

}

angular.bootstrap($('#create-blog')[0],['CreatePost'])