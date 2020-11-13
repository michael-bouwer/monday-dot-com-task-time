export function getTotalHoursLoggedBarData(timesheetData) {
  debugger;
  let labels = [];
  let datasets = [];
  let contentColors = [
    "#00C875", //Green
    "#4ECCC6", //Aquamarine
    "#7E3B8A", //Berry
    "#FAA1F1", //Bubble
    "#66CCFF", //Chill Blue
    "#784BD1", //Dark Purple
    "#FFCB00", //Egg Yolk
    "#5559DF", //Indigo Purple
    "#579BFC", //Light Blue
    "#FDAB3D", //Orange
    "#FFADAD", //Peach
    "#68A1BD", //River Blue
    "#FF7575", //Sunset Red
  ];
  let index = 0.0;
  let hoursTotal = 0.0;
  let hoursWorked = 0.0;
  let hoursOvertime = 0.0;
  let hoursAbsence = 0.0;
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

        if (item.type === "item") {
          hoursWorked +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        } else {
          hoursAbsence +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        }
      });
      sums.forEach((total) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
        hoursTotal += total;
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sums,
      });
      index++;
    });

    hoursOvertime -= hoursAbsence;

    return {
      data: {
        labels,
        datasets,
      },
      total: hoursTotal,
      worked: hoursWorked,
      overtime: hoursOvertime,
      absence: hoursAbsence,
    };
  }
  return null;
}

export function getHoursWorkedBarData(timesheetData) {
  let labels = [];
  let datasets = [];
  let contentColors = [
    "#00C875", //Green
    "#4ECCC6", //Aquamarine
    "#7E3B8A", //Berry
    "#FAA1F1", //Bubble
    "#66CCFF", //Chill Blue
    "#784BD1", //Dark Purple
    "#FFCB00", //Egg Yolk
    "#5559DF", //Indigo Purple
    "#579BFC", //Light Blue
    "#FDAB3D", //Orange
    "#FFADAD", //Peach
    "#68A1BD", //River Blue
    "#FF7575", //Sunset Red
  ];
  let index = 0.0;
  let hoursTotal = 0.0;
  let hoursWorked = 0.0;
  let hoursOvertime = 0.0;
  let hoursAbsence = 0.0;
  if (timesheetData && timesheetData.length > 0) {
    labels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
    timesheetData.forEach((user) => {
      let name = user.user.name;
      let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      let sumsWorked = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        if (item.type === "item") {
          hoursWorked +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);

          sumsWorked[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
          sumsWorked[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
          sumsWorked[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
          sumsWorked[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
          sumsWorked[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
          sumsWorked[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
          sumsWorked[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);
        } else {
          hoursAbsence +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        }
      });
      sums.forEach((total) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
        hoursTotal += total;
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsWorked,
      });
      index++;
    });

    hoursOvertime -= hoursAbsence;

    return {
      data: {
        labels,
        datasets,
      },
      total: hoursTotal,
      worked: hoursWorked,
      overtime: hoursOvertime,
      absence: hoursAbsence,
    };
  }
  return null;
}

export function getHoursOvertimeBarData(timesheetData) {
  let labels = [];
  let datasets = [];
  let contentColors = [
    "#00C875", //Green
    "#4ECCC6", //Aquamarine
    "#7E3B8A", //Berry
    "#FAA1F1", //Bubble
    "#66CCFF", //Chill Blue
    "#784BD1", //Dark Purple
    "#FFCB00", //Egg Yolk
    "#5559DF", //Indigo Purple
    "#579BFC", //Light Blue
    "#FDAB3D", //Orange
    "#FFADAD", //Peach
    "#68A1BD", //River Blue
    "#FF7575", //Sunset Red
  ];
  let index = 0.0;
  let hoursTotal = 0.0;
  let hoursWorked = 0.0;
  let hoursOvertime = 0.0;
  let hoursAbsence = 0.0;
  if (timesheetData && timesheetData.length > 0) {
    labels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
    timesheetData.forEach((user) => {
      let name = user.user.name;
      let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      let sumsOvertime = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        item.timeCaptureForDaysOfWeek.forEach((time, index) => {
          if (parseFloat(time) > 8.0) {
            sumsOvertime[index] += parseFloat(time) - 8.0;
          }
        });

        if (item.type === "item") {
          hoursWorked +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        } else {
          hoursAbsence +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        }
      });
      sums.forEach((total) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
        hoursTotal += total;
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsOvertime,
      });
      index++;
    });

    hoursOvertime -= hoursAbsence;

    return {
      data: {
        labels,
        datasets,
      },
      total: hoursTotal,
      worked: hoursWorked,
      overtime: hoursOvertime,
      absence: hoursAbsence,
    };
  }
  return null;
}

export function getAbsenceBarData(timesheetData) {
  let labels = [];
  let datasets = [];
  let contentColors = [
    "#00C875", //Green
    "#4ECCC6", //Aquamarine
    "#7E3B8A", //Berry
    "#FAA1F1", //Bubble
    "#66CCFF", //Chill Blue
    "#784BD1", //Dark Purple
    "#FFCB00", //Egg Yolk
    "#5559DF", //Indigo Purple
    "#579BFC", //Light Blue
    "#FDAB3D", //Orange
    "#FFADAD", //Peach
    "#68A1BD", //River Blue
    "#FF7575", //Sunset Red
  ];
  let index = 0.0;
  let hoursTotal = 0.0;
  let hoursWorked = 0.0;
  let hoursOvertime = 0.0;
  let hoursAbsence = 0.0;
  if (timesheetData && timesheetData.length > 0) {
    labels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
    timesheetData.forEach((user) => {
      let name = user.user.name;
      let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      let sumsAbsence = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        if (item.type !== "item") {
          item.timeCaptureForDaysOfWeek.forEach((time, index) => {
            sumsAbsence[index] += parseFloat(time);
          });
        }

        if (item.type === "item") {
          hoursWorked +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        } else {
          hoursAbsence +=
            parseFloat(item.timeCaptureForDaysOfWeek[0]) +
            parseFloat(item.timeCaptureForDaysOfWeek[1]) +
            parseFloat(item.timeCaptureForDaysOfWeek[2]) +
            parseFloat(item.timeCaptureForDaysOfWeek[3]) +
            parseFloat(item.timeCaptureForDaysOfWeek[4]) +
            parseFloat(item.timeCaptureForDaysOfWeek[5]) +
            parseFloat(item.timeCaptureForDaysOfWeek[6]);
        }
      });
      sums.forEach((total) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
        hoursTotal += total;
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsAbsence,
      });
      index++;
    });

    hoursOvertime -= hoursAbsence;

    return {
      data: {
        labels,
        datasets,
      },
      total: hoursTotal,
      worked: hoursWorked,
      overtime: hoursOvertime,
      absence: hoursAbsence,
    };
  }
  return null;
}
