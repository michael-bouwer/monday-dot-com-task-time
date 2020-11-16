export function getTotalHoursLoggedBarData(timesheetData) {
  let labels = [];
  let datasets = [];
  let datasetsPie = [];
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
      let sumsTypeItem = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        if (item.type === "item") {
          sumsTypeItem[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
          sumsTypeItem[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
          sumsTypeItem[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
          sumsTypeItem[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
          sumsTypeItem[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
          sumsTypeItem[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
          sumsTypeItem[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);
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
        hoursTotal += total;
      });

      sumsTypeItem.forEach((total, index) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
      });
      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sums,
      });
      datasetsPie.push({
        label: name,
        data: sums,
        backgroundColor: [...contentColors],
      });
      index++;
    });

    return {
      dataBar: {
        labels,
        datasets,
      },
      dataPie: {
        labels,
        datasets: datasetsPie,
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
  let datasetsPie = [];
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
        hoursTotal += total;
      });

      sumsWorked.forEach((total, index) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsWorked,
      });
      datasetsPie.push({
        label: name,
        data: sumsWorked,
        backgroundColor: [...contentColors],
      });
      index++;
    });

    return {
      dataBar: {
        labels,
        datasets,
      },
      dataPie: {
        labels,
        datasets: datasetsPie,
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
  let datasetsPie = [];
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
      let sumsTypeItem = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        if (item.type === "item") {
          sumsTypeItem[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
          sumsTypeItem[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
          sumsTypeItem[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
          sumsTypeItem[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
          sumsTypeItem[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
          sumsTypeItem[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
          sumsTypeItem[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);
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
      sums.forEach((total, index) => {
        hoursTotal += total;
      });

      sumsTypeItem.forEach((total, index) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
          sumsOvertime[index] = total - 8;
        }
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsOvertime,
      });
      datasetsPie.push({
        label: name,
        data: sumsOvertime,
        backgroundColor: [...contentColors],
      });
      index++;
    });

    return {
      dataBar: {
        labels,
        datasets,
      },
      dataPie: {
        labels,
        datasets: datasetsPie,
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
  let datasetsPie = [];
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
      let sumsTypeItem = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      user.data.forEach((item) => {
        sums[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
        sums[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
        sums[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
        sums[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
        sums[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
        sums[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
        sums[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);

        if (item.type === "item") {
          sumsTypeItem[0] += parseFloat(item.timeCaptureForDaysOfWeek[0]);
          sumsTypeItem[1] += parseFloat(item.timeCaptureForDaysOfWeek[1]);
          sumsTypeItem[2] += parseFloat(item.timeCaptureForDaysOfWeek[2]);
          sumsTypeItem[3] += parseFloat(item.timeCaptureForDaysOfWeek[3]);
          sumsTypeItem[4] += parseFloat(item.timeCaptureForDaysOfWeek[4]);
          sumsTypeItem[5] += parseFloat(item.timeCaptureForDaysOfWeek[5]);
          sumsTypeItem[6] += parseFloat(item.timeCaptureForDaysOfWeek[6]);
        }

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
        hoursTotal += total;
      });

      sumsTypeItem.forEach((total, index) => {
        if (total > 8.0) {
          //average working hours in working day
          hoursOvertime += total - 8;
        }
      });

      if (index > contentColors.length) index = 0;
      datasets.push({
        label: name,
        backgroundColor: contentColors[index],
        data: sumsAbsence,
      });
      datasetsPie.push({
        label: name,
        data: sumsAbsence,
        backgroundColor: [...contentColors],
      });
      index++;
    });

    return {
      dataBar: {
        labels,
        datasets,
      },
      dataPie: {
        labels,
        datasets: datasetsPie,
      },
      total: hoursTotal,
      worked: hoursWorked,
      overtime: hoursOvertime,
      absence: hoursAbsence,
    };
  }
  return null;
}
