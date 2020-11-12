export function getTotalHoursLoggedBarData(timesheetData) {
  debugger;
  let labels = [];
  let datasets = [];
  let contentColors = [
    "#00C875",
    "#7E3B8A",
    "#7F5347",
    "#66CCFF",
    "#784BD1",
    "#FFCB00",
    "#579BFC",
    "#FDAB3D",
    "#68A1BD",
    "#FF7575",
  ];
  let index = 0;
  if (timesheetData && timesheetData.length > 0) {
    labels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
    timesheetData.forEach((user) => {
      let name = user.user.name;
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
      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sums,
      });
      index++;
    });

    return {
      labels,
      datasets,
    };
  }
  return null;
}

export function getHoursWorkedBarData(timesheetData) {}

export function getHoursOvertimeBarData(timesheetData) {}

export function getAbsenceBarData(timesheetData) {}
