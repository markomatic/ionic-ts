module controllers {
  const convertToDate = str => moment.tz(str, 'Australia/Sydney');
  const convertToGMTDate = str => moment.tz(str, 'Atlantic/Reykjavik');

  class JobsController {
    constructor($scope, jobs) {
      $scope.formatDate = date => convertToDate(date).format('ddd, MMM DD');

      $scope.countWorkingDays = shifts => {
        const weekStart = convertToGMTDate(shifts[0].startDate).startOf('week').date();
        const weekEnd = weekStart + 4;
        let daysCount = 0;

        for (let i = 0; i < shifts.length; i++) {
          const date = convertToGMTDate(shifts[i].startDate);
          const day = date.date();

          if (day > weekEnd) {
            break;
          }

          day >= weekStart && day <= weekEnd && daysCount++;
        }

        return `${daysCount === 5 && 'ALL' || daysCount} DAYS`;
      };

      $scope.firstWeekShifts = (shift, index, shifts) => {
        const weekStart = convertToGMTDate(shifts[0].startDate).startOf('week').date();
        const weekEnd = weekStart + 4;
        const day = convertToGMTDate(shift.startDate).date();

        return day <= weekEnd;
      };

      $scope.getDay = date => {
        return convertToDate(date).format('ddd');
      };

      $scope.getDate = date => convertToDate(date).format('MMM DD');

      $scope.getTime = date => convertToDate(date).format('h:mm A z');

      $scope.currentJob = jobs[0];
    }
  }

  app.controller('JobsController', JobsController);
}
