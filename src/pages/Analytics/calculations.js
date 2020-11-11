export function getTotalHoursLoggedBarData(timesheetData) {
  debugger;
  let labels = [];
  let datasets = [];
  if (timesheetData && timesheetData.length > 0) {
    labels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
    timesheetData.forEach((user) => {
      let name = user.user.name;
      let data = [];
      let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);
      });
      data = sums;
      datasets.push({
        label: name,
        data: sums,
      });
    });

    return {
      labels,
      datasets,
    };
  }
  return null;
}
