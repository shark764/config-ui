angular.orDefault = function orDefault(target, alt) {
  return angular.isDefined(target) ? target : alt;
}